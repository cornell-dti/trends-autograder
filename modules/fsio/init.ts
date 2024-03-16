import { Effect } from "effect";
import promptAssignmentNumber from "./prompt";
import { SUBMISSIONS_DIR, criticalFilePaths } from "../constants";
import { bunLs } from "../stdlib/bun-effect";
import createTmpDirAndCsvFile from "./tmpcsv";

/**
 * Initializes filesystem, returns critical variables.
 * @returns An Effect that resolves to a tuple of the assignment number, critical file, and netIDs.
 */
const init = (_: unknown) =>
    Effect.gen(function* ($) {
        const num = yield* $(promptAssignmentNumber());

        const assignmentNumber = `A${num}`;
        const criticalFilePath = criticalFilePaths[assignmentNumber];
        const netIDs = yield* $(bunLs(SUBMISSIONS_DIR));

        yield* $(createTmpDirAndCsvFile(assignmentNumber));

        return [netIDs, assignmentNumber, criticalFilePath] as const;
    });

export default init;
