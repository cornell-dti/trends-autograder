import { Effect } from "effect";
import { bunExec, bunWrite } from "../stdlib/bun-effect";
import { OUTPUT_FILE, TMP_DIR } from "../constants";

/**
 * Create tmp directory and cms.csv file.
 * @param assignmentNumber The assignment number.
 * @returns An Effect that resolves once the tmp directory and cms.csv file have been created.
 */
const createTmpDirAndCsvFile = (assignmentNumber: number) =>
    Effect.gen(function* ($) {
        yield* $(bunExec(["mkdir", TMP_DIR]));
        yield* $(
            bunWrite(
                OUTPUT_FILE,
                `NetID,Assignment ${assignmentNumber},Total,Adjustments,Add Comments`
            )
        );
    });

export default createTmpDirAndCsvFile;
