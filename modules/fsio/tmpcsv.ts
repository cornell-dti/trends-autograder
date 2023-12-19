import { Effect } from "effect";
import { bunExec, bunWrite } from "../stdlib/bun-effect";

/**
 * Create tmp directory and cms.csv file.
 * @param assignmentNumber The assignment number.
 * @returns An Effect that resolves once the tmp directory and cms.csv file have been created.
 */
const createTmpDirAndCsvFile = (assignmentNumber: string) =>
    Effect.gen(function* ($) {
        yield* $(bunExec(["mkdir", "tmp"]));
        yield* $(
            bunWrite(
                "cms.csv",
                `NetID,${assignmentNumber},Total,Adjustments,Add Comments`
            )
        );
    });

export default createTmpDirAndCsvFile;
