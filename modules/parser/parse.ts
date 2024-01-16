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
});

/**
 * The schema's corresponding TypeScript type.
 */
export type TestObj = z.infer<typeof TestObjSchema>;

/**
 * Given a TestObj, calculate the grade.
 * TODO: handle NaN with an Effect fail -- let it propagate up to get caught.
 */
const calcGrade = (obj: TestObj) =>
    Effect.succeed(Math.round(100 * (obj.numPassedTests / obj.numTotalTests)));

/**
 * Given a JSON string, parse it into a TestObj and calculate the grade.
 * @param json The JSON string to parse.
 * @returns The grade, between 0 and 100.
 */
const parse = (json: string) =>
    pipe(json, JsonStrToObj(TestObjSchema), Effect.flatMap(calcGrade));

export default parse;
