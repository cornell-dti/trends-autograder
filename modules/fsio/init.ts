import { Effect } from "effect";
import promptAssignmentNumber from "./prompt";
import { criticalFiles } from "../constants";
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
        const criticalFile = criticalFiles[assignmentNumber];
        const netIDs = yield* $(bunLs("Submissions"));

        yield* $(createTmpDirAndCsvFile(assignmentNumber));

        return [netIDs, assignmentNumber, criticalFile] as const;
    });

export default init;
