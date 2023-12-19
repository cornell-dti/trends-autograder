import { Effect } from "effect";
import { bunExec, bunReadFile, bunWrite } from "../stdlib/bun-effect";
import parse from "../parser/parse";

export type DataIn = {
    assignmentNum: string;
    criticalFile: string;
    netID: string;
};

/**
 * Constructs a single fiber that runs the tests for a single student, calculates the grades, and returns the netID and grade as a tuple.
 * @param data The data to use for the fiber.
 * @returns An Effect that resolves to a tuple of the netID and grade.
 */
const makeFiber = (data: DataIn) =>
    Effect.gen(function* ($) {
        const { assignmentNum, criticalFile, netID } = data;

        console.log(`Starting worker for ${netID}...`);

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

        console.log(`Installing dependencies for ${netID}...`);

        yield* $(
            bunExec(["pnpm", "install"], {
                cwd: `tmp/${netID}`,
            })
        );

        console.log(`Running tests for ${netID}...`);

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

        // Parse logs, calculate grade

        console.log(`Parsing logs for ${netID}...`);

        const logs = yield* $(bunReadFile(`tmp/${netID}/logs.json`));

        console.log(`Calculating grade for ${netID}...`);

        const grade = yield* $(parse(logs));

        console.log(`Grade for ${netID}: ${grade}`);

        console.log(`Ending worker for ${netID}...`);

        return [netID, grade] as const;
    });

export default makeFiber;
