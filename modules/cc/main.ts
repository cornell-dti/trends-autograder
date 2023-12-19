import { Effect, pipe } from "effect";
import { writeGrades } from "../fsio/writeout";
import makeFiber from "./fiber";

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
      Effect.all(
        netIDs.map((netID) => makeFiber({ assignmentNum, criticalFile, netID })), 
        { concurrency: "unbounded" }
      ),
      Effect.tap(() => console.log("Finished executing all fibers!")),
      Effect.flatMap((grades) => writeGrades(grades))
    );

export default runMain;
