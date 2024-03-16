import { Effect, Either, Option, pipe } from "effect";
import { bunReadFile } from "../stdlib/bun-effect";
import parse from "../parser/parse";

/**
 * Constructs a single fiber that reads the logs for a student to calculate their grade and returns it.
 * @param netID The student's netID
 * @returns An Effect that resolves to a tuple of the netID and grade.
 */
const readLogs = (netID: string, filePath: string) =>
    Effect.gen(function* ($) {
        const res = yield* $(
            pipe(bunReadFile(filePath), Effect.flatMap(parse))
        );
        return [netID, ...res] as const;
    });

export default readLogs;
