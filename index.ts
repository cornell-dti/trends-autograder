import { Effect, Match } from "effect";
import { criticalFiles } from "./modules/constants";
import { removeUndefinedEntries, tokenize } from "./modules/stdlib/fns";
import { OutputtedData } from "./modules/worker";
import {
    bunExec,
    bunLs,
    bunReadLine,
    bunWrite,
} from "./modules/stdlib/bun-effect";
import promptAssignmentNumber from "./modules/fsio/prompt";
import createTmpDirAndCsvFile from "./modules/fsio/tmpcsv";
import { writeGrades } from "./modules/fsio/writeout";

/**
 * Initializes filesystem, returns critical variables.
 */
const init = () =>
    Effect.gen(function* ($) {
        const num = yield* $(promptAssignmentNumber());

        const assignmentNumber = `A${num}`;
        const criticalFile = criticalFiles[assignmentNumber];
        const netIDs = bunLs("Submissions");

        yield* $(createTmpDirAndCsvFile(assignmentNumber));

        return [assignmentNumber, criticalFile, netIDs] as const;
    });

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

    await writeGrades(grades);

    console.log("Done!");

    return;
};

// Entry point
