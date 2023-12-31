import { Effect } from "effect";
import { bunExec } from "../stdlib/bun-effect";
import { SOLUTIONS_DIR, SUBMISSIONS_DIR, TMP_DIR } from "../constants";

type DataIn = {
    assignmentNum: string;
    criticalFile: string;
    netID: string;
};

/**
 * Constructs a single fiber that runs the tests for a single student and writes the logs to a file.
 * @param data The data to use for the fiber.
 * @returns An Effect that resolves to a tuple of the netID and grade.
 */
const writeLogs = (data: DataIn) =>
    Effect.gen(function* ($) {
        const { assignmentNum, criticalFile, netID } = data;

        // Copy critical files

        yield* $(
            bunExec([
                "cp",
                "-r",
                `${SOLUTIONS_DIR}/${assignmentNum}/`,
                `${TMP_DIR}/${netID}`,
            ])
        );

        yield* $(
            bunExec([
                "cp",
                `${SUBMISSIONS_DIR}/${netID}/${criticalFile}`,
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
