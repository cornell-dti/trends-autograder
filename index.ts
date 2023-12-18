import { criticalFiles } from "./modules/constants";
import { tokenize } from "./modules/helpers";
import { OutputtedGrades } from "./modules/worker";

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
    const assignmentNumber = `A${num}`;
    const criticalFile = criticalFiles[assignmentNumber];

    const proc = Bun.spawn(["mkdir", "tmp"]);
    await proc.exited;

    const { stdout, stderr, exited } = Bun.spawn(["ls", "Submissions"]);
    await exited;
    const stdoutStr = await new Response(stdout).text();
    const netIDs = tokenize(stdoutStr);

    run([assignmentNumber, criticalFile, netIDs]);
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
    const grades: { [netID: string]: number } = {};

    const workerPromises = netIDs.map(
        (netID) =>
            new Promise<void>((resolve, reject) => {
                const worker = new Worker(
                    new URL("./modules/worker.ts", import.meta.url).href
                );

                worker.postMessage({ assignmentNum, criticalFile, netID });
                worker.onmessage = (event: MessageEvent) => {
                    const { netID, grade }: OutputtedGrades = event.data;
                    grades[netID] = grade;
                    resolve();
                };

                worker.onerror = (event: ErrorEvent) => {
                    console.log(event);
                };
            })
    );

    console.log("Running tests...");

    await Promise.all(workerPromises);

    console.log("Done running tests.");

    await write(grades);
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
            ...Object.entries(grades).map(
                ([netID, grade]) => `${netID},${grade},${grade},,\n`
            ),
        ],
        { type: "text/csv" }
    );

    Bun.write("cms.csv", csv);

    console.log("Done!");
};

// Entry point
await prompt(init);
