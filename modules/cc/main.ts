import { Effect, pipe } from "effect";
import { GradebookEntry, writeGrades } from "../fsio/writeout";
import writeLogs from "./write";
import { TMP_DIR, maxConcurrency, maxTimeout } from "../constants";
import readLogs from "./read";
import init from "../fsio/init";

/**
 * Runs the main program.
 * @returns An Effect that resolves only after the grades have been written to a CSV file.
 */
const runMain = () =>
    pipe(
        "MAIN PROGRAM PIPELINE =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=",

        init,

        Effect.tap(([netIDs, assignmentNum, criticalFile]) =>
            Effect.all(
                netIDs.map((netID) =>
                    writeLogs({ assignmentNum, criticalFile, netID })
                ),
                { concurrency: maxConcurrency }
            ).pipe(Effect.timeout(maxTimeout))
        ),

        Effect.flatMap(([netIDs, assignmentNum, _]) =>
            Effect.gen(function* ($) {
                const a = yield* $(
                    Effect.all(
                        netIDs
                            .map((netID) =>
                                readLogs(
                                    netID,
                                    `${TMP_DIR}/${netID}/logs.json`
                                ).pipe(
                                    Effect.catchAll((_) => Effect.succeed(null))
                                )
                            )
                            .filter((e) => e !== null),
                        { concurrency: maxConcurrency }
                    )
                );

                const b = assignmentNum;

                return [a, b] as const;
            })
        ),

        Effect.flatMap(([grades, assignmentNum]) =>
            writeGrades(grades as GradebookEntry[], assignmentNum)
        ),

        Effect.tap(() => console.log("✅ Done!"))
    );

export default runMain;
