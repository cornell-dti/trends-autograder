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
const getSubstring = (regex: RegExp) => (str: string) => {
    const match = str.match(regex);
    return Match.type<RegExpMatchArray | null>().pipe(
        Match.when(null, () => Effect.fail("No match")),
        Match.orElse(() => Effect.succeed(match![0]))
    )(match);
};

/**
 * Parses a substring that already matched the regex,
 * and returns the number of failed/succeeded tests.
 * @param str The substring to parse. Precondition: it must match the regex.
 * @returns The number of failed/succeeded tests.
 */
const parseSubstring = (str: string) =>
    Effect.succeed(parseInt(str.split(" ")[0]));

/**
 * Parses some test output for a resulting grade.
 * @param input A string containing the output of `pnpm test`, which could be VERY long.
 * @returns A grade from 0 to 100.
 */
const parse = (input: string) =>
    pipe(
        pipe(input, getSubstring(failureRegex), Effect.flatMap(parseSubstring)),
        Effect.flatMap((f) =>
            pipe(
                input,
                getSubstring(successRegex),
                Effect.flatMap(parseSubstring),
                Effect.flatMap((s) => calculateGrade(f)(s))
            )
        )
    );

export default parse;
