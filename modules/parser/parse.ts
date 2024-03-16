import { Effect, Match, pipe } from "effect";
import { z } from "zod";
import JsonStrToObj from "../stdlib/json";

/**
 * Our desired schema for the JSON log we're reading.
 */
const TestObjSchema = z.object({
    numTotalTests: z.number(),
    numPassedTests: z.number(),
    numFailedTests: z.number(),
    numPendingTests: z.number(),
    numTodoTests: z.number(),
    success: z.boolean(),
    testResults: z.array(
        z.object({
            assertionResults: z.array(
                z.union([
                    z.object({
                        status: z.literal("passed"),
                        title: z.string(),
                    }),
                    z.object({
                        status: z.literal("failed"),
                        title: z.string(),
                        failureMessages: z.array(z.string()),
                        location: z.object({
                            line: z.number(),
                        }),
                    }),
                ])
            ),
        })
    ),
});

/**
 * The schema's corresponding TypeScript type.
 */
export type TestObj = z.infer<typeof TestObjSchema>;

/**
 * Given a TestObj, calculate the grade.
 */
const generateGrade = (obj: TestObj) =>
    Effect.succeed(Math.round(100 * (obj.numPassedTests / obj.numTotalTests)));

/**
 * Given a TestObj, generate a string comment
 */
const generateComment = (obj: TestObj) =>
    Effect.succeed(
        obj.numFailedTests === 0
            ? "Great job!"
            : obj.testResults[0].assertionResults
                  .filter((result) => result.status === "failed")
                  .map(
                      (result) =>
                          result.status === "failed" &&
                          `TEST CASE FAILURE ON LINE ${result.location.line}: ${result.title}: ${result.failureMessages[0]}`.replaceAll(
                              ",",
                              " "
                          )
                  )
                  .join(" | ")
    );

const createEntry = (obj: TestObj) =>
    Effect.gen(function* ($) {
        const grade = yield* $(generateGrade(obj));
        const comment = yield* $(generateComment(obj));
        return [grade + "", comment] as const;
    });

/**
 * Given a JSON string, parse it into a TestObj, and return a gradebook entry.
 * @param json The JSON string to parse.
 * @returns The grade, between 0 and 100.
 */
const parse = (json: string) =>
    pipe(json, JsonStrToObj(TestObjSchema), Effect.flatMap(createEntry));

export default parse;
