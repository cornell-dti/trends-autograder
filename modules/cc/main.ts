import { Effect, pipe } from "effect";
import { writeGrades } from "../fsio/writeout";
import writeLogs from "./write";
import { TMP_DIR, maxTimeout } from "../constants";
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
                { concurrency: "unbounded" }
            ).pipe(Effect.timeout(maxTimeout))
        ),

        Effect.flatMap(([netIDs, ..._]) =>
            Effect.all(
                netIDs.map((netID) =>
                    readLogs(netID, `${TMP_DIR}/${netID}/logs.json`)
                ),
                { concurrency: "unbounded" }
            )
        ),

        Effect.flatMap((grades) => writeGrades(grades)),

        Effect.tap(() => console.log("✅ Done!"))
    );

export default runMain;
