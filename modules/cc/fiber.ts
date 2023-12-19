import { Effect } from "effect";
import { bunExec, bunWrite } from "../stdlib/bun-effect";
import { nodeExec } from "../stdlib/node-effect";
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

        // prettier-ignore
        yield* $(bunExec(["cp", "-r", `solutions/${assignmentNum}/`, `tmp/${netID}`]));
        // prettier-ignore
        yield* $(bunExec(["cp", `Submissions/${netID}/${criticalFile}`, `tmp/${netID}/${criticalFile}`, ]));
        // prettier-ignore
        yield* $(bunExec(["pnpm", "install"], {
            cwd: `tmp/${netID}`,
        }));

        console.log(`BEFORE...`);

        const [stdout, stderr] = yield* $(
            bunExec(
                [
                    "pnpm",
                    "test",
                    "--",
                    "--reporter=json",
                    "--outputFile=./logs.json",
                ],
                {
                    cwd: `tmp/${netID}`,
                }
            )
        );

        console.log(`AFTER...`);

        const logs = stdout + stderr;

        yield* $(bunWrite(`tmp/${netID}/logs.txt`, logs));

        const grade = yield* $(parse(logs));

        return [netID, grade] as const;
    });

export default makeFiber;
