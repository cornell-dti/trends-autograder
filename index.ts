/**
 * The following script auto-grades the student submission.
 * A brief overview:
 *
 * Parser Module: given a string, parses the string and returns a grade.
 * 1. Parse the string to get the number of failed tests.
 * 2. Subtract 10 points from 100 for each failed test.
 *
 * Phase 1
 * 1. Prompt the user via CLI for either "A1", "A2", "A3", or "A4". This is the assignment number that we are grading.
 *    - Save this as `assignmentNumber`
 * 2. Based on the assignment number, determine the arbitrary "critical file" that we will be grading.
 *    - A1 is "main.js"
 *    - A2 is "src/main.ts"
 *    - A3 is "src/Paginator.tsx"
 *    - A4 is "src/components/Gallery.tsx"
 *    - Save this as `criticalFile`
 * 3. Create the temporary directory /tmp
 * 4. Read all subfolders present in the /Submissions directory. These are the student submissions, each folder named after the student's NetID.
 *    - Store the names of these subfolders in a string array called `NetIDs`.
 *
 * Phase 2
 * 5. Initialize a TreeMap from NetID to grades, `OutputtedGrades`, sorted by NetID alphabetically.
 * 6. For each NetID in `NetIDs`, spawn a Web Worker to do the following:
 *    - Create the directory /tmp/[NetID].
 *    - Copy the contents of the answer repo into the temporary directory /tmp/[NetID]: pnpm dlx degit cornell-dti/trends-mono/frontend-hw-${assignmentNumber}-solution tmp/${NetID}
 *    - Copy the student's critical file (which should be the only file in the submission folder) into the temporary directory /tmp/[NetID] (overwriting the answer repo's critical file).
 *    - Run `pnpm install` in the temporary directory /tmp/[NetID]
 *    - Run `yes q | pnpm test` in the temporary directory /tmp/[NetID] and save the output as `output`.
 *    - Invoke the parser module with `output` as the argument and save the result as `grade`.
 *    - Append the mapping of `NetID` to `grade` to `OutputtedGrades`.
 * 7. Only after all Web Workers have finished, continue to the next phase.
 *
 * Phase 3
 * 8. Write the following first line to a new file called `cms.csv`: "NetID,A1,Total,Adjustments,Add Comments"
 * 9. For each NetID in `NetIDs`, append the following line to `cms.csv`: "[NetID],[OutputtedGrades[NetID]],[OutputtedGrades[NetID]],,"
 * 10. Output "Done!" to the console.
 */

import { criticalFiles } from "./modules/constants";
import { tokenize } from "./modules/helpers";
import { OutputtedGrades } from "./modules/worker";

/*
 * For Maintainers:
 * Confused? Much of the codebase is functional.
 * Refer back to CS 3110.
 * Then, read the documentation for [Effect](https://effect.website), a library for functional programming in TypeScript.
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
                console.log("Spawning worker for", netID);

                const worker = new Worker(
                    new URL("./modules/worker.ts", import.meta.url).href
                );

                worker.postMessage({ assignmentNum, criticalFile, netID });
                worker.onmessage = (event: MessageEvent) => {
                    const { netID, grade }: OutputtedGrades = event.data;
                    grades[netID] = grade;
                    console.log("Posting grade for", netID, grade);
                    resolve();
                };

                worker.onerror = (event: ErrorEvent) => {
                    console.log("Worker error! for ", netID);
                    console.error(event);
                };
            })
    );

    await Promise.all(workerPromises);

    console.log("Done with workers!");

    await write(grades);
};

const write = async (grades: { [netID: string]: number }) => {
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

await prompt(init);
