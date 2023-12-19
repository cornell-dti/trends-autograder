import { Effect, Match, pipe } from "effect";

/**
 * Looking for a substring of the form:
 * 22 fail
 */
const failureRegex = /(\d+) fail/;

/**
 * Looking for a substring of the form:
 * 25 pass
 */
const successRegex = /(\d+) pass/;

/**
 * Returns a grade from 0 to 100 based on the number of failed tests.
 * @param arr The number of failed tests.
 * @returns A grade from 0 to 100.
 */
const calculateGrade = (failed: number) => (succeeded: number) =>
    Effect.succeed(Math.round((succeeded / (failed + succeeded)) * 100));

/**
 * Gets the substring of a string that matches a regular expression.
 * @param regex The regular expression to match.
 * @param str The string to match against.
 * @returns The substring of `str` that matches `regex`.
 */
const getSubstring = (regex: RegExp, str: string) =>
    Effect.gen(function* ($) {
        const match = str.match(regex);
        if (match === null) {
            return yield* $(Effect.fail("No match"));
        }
        return yield* $(Effect.succeed(match[0]));
    });

/**
 * Parses a substring that already matched the regex,
 * and returns the number of failed/succeeded tests.
 */
const parseSubstring = (str: string) =>
    Effect.succeed(parseInt(str.split(" ")[0]));

/**
 * Parses some test output for a resulting grade.
 * @param input A string containing the output of `pnpm test`, which could be VERY long.
 * @returns A grade from 0 to 100, or -1 if the input is invalid.
 */
const parse = (input: string) =>
    Effect.gen(function* ($) {
        const fstr = yield* $(getSubstring(failureRegex, input));
        const sstr = yield* $(getSubstring(successRegex, input));
        const f = yield* $(parseSubstring(fstr));
        const s = yield* $(parseSubstring(sstr));
        return yield* $(calculateGrade(f)(s));
    });

export default parse;
