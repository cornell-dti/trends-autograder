/**
 * @module stdlib/json
 * Type-safe, Effect-ful JSON parsing.
 */

import { Effect, Match, pipe } from "effect";
import { ZodError, z } from "zod";

const JsonStrToObj =
    <T>(schema: z.ZodSchema<T>) =>
    (json: string) =>
        pipe(
            schema.safeParse(JSON.parse(json)),
            Match.type<
                { success: true; data: T } | { success: false; error: ZodError }
            >().pipe(
                // @ts-expect-error
                Match.when({ success: true }, ({ data }) =>
                    Effect.succeed(data)
                ),
                Match.when({ success: false }, ({ error }) =>
                    Effect.fail(error)
                ),
                Match.exhaustive
            )
        );

export default JsonStrToObj;
