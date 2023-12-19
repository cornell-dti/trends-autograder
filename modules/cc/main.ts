import { Effect, pipe } from "effect";
import { writeGrades } from "../fsio/writeout";
import writeLogs from "./write";
import { maxTimeout } from "../constants";
import readLogs from "./read";

/**
 * Runs all workloads in parallel, and then writes the grades to a CSV file.
 * @param assignmentNum The assignment number.
 * @param criticalFile The critical file path.
 * @param netIDs The netIDs of the students.
 * @returns An Effect that resolves only after the grades have been written to a CSV file.
 */
// prettier-ignore
const runMain = 
  ([assignmentNum, criticalFile, netIDs]: readonly [string, string, string[]]) => 
    pipe(
      Effect.succeed(netIDs),
      Effect.tap((netIDs: string[]) => Effect.all(
        netIDs.map((netID) => writeLogs({ assignmentNum, criticalFile, netID })), 
        { concurrency: "unbounded" }
      ).pipe(Effect.timeout(maxTimeout))),
      Effect.flatMap((netIDs) => Effect.all(
        netIDs.map((netID) => readLogs(netID)),
        { concurrency: "unbounded" }
      )),
      Effect.flatMap((grades) => writeGrades(grades))
    );

export default runMain;
