import { Effect } from "effect";
import { bunExec } from "../stdlib/bun-effect";
import { SOLUTIONS_DIR, SUBMISSIONS_DIR, TMP_DIR } from "../constants";
import { getFileName } from "../stdlib/fns";

type DataIn = {
    assignmentNum: number;
    criticalFile: string;
    netID: string;
};

/**
 * Constructs a single fiber that runs the tests for a single student and writes the logs to a file.
 * @param data The data to use for the fiber.
 * @returns An Effect that resolves once the logs have been written.
 */
const writeLogs = (data: DataIn) =>
    Effect.gen(function* ($) {
        const { assignmentNum, criticalFile, netID } = data;

        // Copy solution templates into temp

        yield* $(
            bunExec([
                "cp",
                "-r",
                `${SOLUTIONS_DIR}/A${assignmentNum}/`,
                `${TMP_DIR}/${netID}`,
            ])
        );

        // Copy student submission into correct spot in solution template in temp

        yield* $(
            bunExec([
                "cp",
                `${SUBMISSIONS_DIR}/${netID}/${getFileName(criticalFile)}`,
                `${TMP_DIR}/${netID}/${criticalFile}`,
            ])
        );

        // Install dependencies

        yield* $(
            bunExec(["pnpm", "install"], {
                cwd: `${TMP_DIR}/${netID}`,
            })
        );

        // Run tests, save logs

        yield* $(
            bunExec(
                [
                    "pnpm",
                    "test",
                    "--",
                    "--run",
                    "--reporter=json",
                    "--outputFile=./logs.json",
                ],
                {
                    cwd: `${TMP_DIR}/${netID}`,
                }
            )
        );

        return `Logs for ${netID} successfully written.`;
    });

export default writeLogs;
