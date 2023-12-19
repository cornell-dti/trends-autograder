import { Effect, Either, Option, pipe } from "effect";
import { bunReadFile } from "../stdlib/bun-effect";
import parse from "../parser/parse";
import { ERROR, TMP_DIR } from "../constants";

/**
 * Constructs a single fiber that reads the logs for a student to calculate their grade and returns it.
 * @param netID The student's netID
 * @returns An Effect that resolves to a tuple of the netID and grade.
 */
const readLogs = (netID: string) =>
    Effect.gen(function* ($) {
        const logs = yield* $(
            Effect.either(bunReadFile(`${TMP_DIR}/${netID}/logs.json`))
        );

        return Either.isLeft(logs)
            ? ([netID, ERROR] as const)
            : ([netID, "" + (yield* $(parse(logs.right)))] as const);
    });

export default readLogs;
