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
        const val = pipe(
            bunReadFile(`${TMP_DIR}/${netID}/logs.json`),
            Effect.flatMap(parse)
        ).pipe(Effect.catchAll((_) => Effect.succeed(`${ERROR}`)));
        return [netID, `${val}`] as const;
    });

export default readLogs;
