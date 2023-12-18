import { criticalFiles } from "./modules/constants";
import { removeUndefinedEntries, tokenize } from "./modules/helpers";
import { OutputtedData } from "./modules/worker";

/**
 * Prompts the user for an assignment number; sets up the file system.
 * @param spawn A callback function to start the program once everything is setup.
 * @returns A promise that resolves once the user has entered a valid assignment number.
 */
const prompt = async (spawn: (num: number) => Promise<void>) => {
    process.stdout.write("Enter assignment number (1-4): ");
    for await (const line of console) {
        const assignmentNumber = parseInt(line);
        if (assignmentNumber >= 1 && assignmentNumber <= 4) {
            await spawn(assignmentNumber);
            return;
        } else {
            throw new Error("Invalid assignment number");
        }
    }
};

/**
 * Initializes relevant variables to their proper values and calls `run`.
 * @param num The assignment number.
 */
const init = async (num: number) => {
    console.log("Initializing...");

    const assignmentNumber = `A${num}`;
    const criticalFile = criticalFiles[assignmentNumber];

    const proc = Bun.spawn(["mkdir", "tmp"]);
    await proc.exited;

    await Bun.write(
        "cms.csv",
        `NetID,${assignmentNumber},Total,Adjustments,Add Comments`
    );

    const { stdout, stderr, exited } = Bun.spawn(["ls", "Submissions"]);
    await exited;
    const stdoutStr = await new Response(stdout).text();
    const netIDs = tokenize(stdoutStr);

    run([assignmentNumber, criticalFile, netIDs]);
};

/**
 * Writes the grades to a CSV file and ends the program.
 * @param grades An object mapping netIDs to grades.
 */
const write = async (grades: { [netID: string]: number }) => {
    console.log("Writing grades to CSV file...");

    const csv = new Blob(
        [
            "NetID,A1,Total,Adjustments,Add Comments\n",
            ...Object.entries(grades)
                .sort(([netID1], [netID2]) => netID1.localeCompare(netID2))
                .map(([netID, grade]) => `${netID},${grade},${grade},,\n`),
        ],
        { type: "text/csv" }
    );

    await Bun.write("cms.csv", csv);
};

/**
 * Runs the program.
 * - Creates web workers for each student for parallel processing.
 * - Calls `write` to write the grades to a CSV file.
 * @param [assignmentNum: string, criticalFile: string, netIDs: string[]]
 */
const run = async ([assignmentNum, criticalFile, netIDs]: [
    string,
    string,
    string[]
]) => {
    let grades: { [netID: string]: number } = {};

    const workerPromises = netIDs.map(
        (netID) =>
            new Promise<void>((resolve, reject) => {
                const worker = new Worker(
                    new URL("./modules/worker.ts", import.meta.url).href
                );

                worker.postMessage({ assignmentNum, criticalFile, netID });
                worker.onmessage = (event: MessageEvent) => {
                    const res: OutputtedData = event.data;
                    if (res.state === "failure") {
                        console.error(res.error);
                        worker.terminate();
                        reject(new Error(res.error));
                    } else {
                        grades[res.netID] = res.grade;
                        resolve();
                    }
                };

                worker.onerror = (event: ErrorEvent) => {
                    console.error("Worker error:", event.message);
                    worker.terminate();
                    reject(new Error("Worker error: " + event.message));
                };
            })
    );

    console.log("Running workers...");

    await Promise.allSettled(workerPromises);

    // ADJUSTMENTS
    // arbitrarily wait 3 seconds to make sure all workers have terminated (there's usually one hanging behind)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // remove undefined entries (the one hanging behind pushes [undefined, undefined] to the object)
    removeUndefinedEntries(grades);

    console.log("Done running workers.");

    console.log("Grades:", grades);

    await write(grades);

    console.log("Done!");

    return;
};

// Entry point
await prompt(init);
