import { Effect } from "effect";
import { bunExec } from "../stdlib/bun-effect";

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
        console.log(`Writing logs for ${data.netID}...`);

        const { assignmentNum, criticalFile, netID } = data;

        // Copy critical files

        yield* $(
            bunExec(["cp", "-r", `solutions/${assignmentNum}/`, `tmp/${netID}`])
        );

        yield* $(
            bunExec([
                "cp",
                `Submissions/${netID}/${criticalFile}`,
                `tmp/${netID}/${criticalFile}`,
            ])
        );

        // Install dependencies

        yield* $(
            bunExec(["pnpm", "install"], {
                cwd: `tmp/${netID}`,
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
                    cwd: `tmp/${netID}`,
                }
            )
        );

        return `Logs for ${netID} successfully written.`;
    });

export default writeLogs;
