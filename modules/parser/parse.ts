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
 * Looking for a substring of the form:
 * SyntaxError: ...
 */
const syntaxError = "SyntaxError:";

/**
 * Returns a grade from 0 to 100 based on the number of failed tests.
 * @param arr The number of failed tests.
 * @returns A grade from 0 to 100.
 */
const calculateGrade = (failed: number) => (succeeded: number) =>
    Math.round((succeeded / (failed + succeeded)) * 100);

/**
 * Gets the substring of a string that matches a regular expression.
 * @param regex The regular expression to match.
 * @param str The string to match against.
 * @returns The substring of `str` that matches `regex`.
 */
const getSubstring = (regex: RegExp) => (str: string) => {
    const match = str.match(regex);
    if (match === null) throw new Error("No regex match found: " + str);
    else return match[0];
};

/**
 * Parses a substring that already matched the regex,
 * and returns the number of failed/succeeded tests.
 */
const parseSubstring = (str: string) => parseInt(str.split(" ")[0]);

/**
 * Parses some test output for a resulting grade.
 * @param input A string containing the output of `pnpm test`, which could be VERY long.
 * @returns A grade from 0 to 100, or -1 if the input is invalid.
 */
const parse = (input: string) => {
    try {
        // prettier-ignore
        return calculateGrade(
            parseSubstring(getSubstring(failureRegex)(input))
        )(
            parseSubstring(getSubstring(successRegex)(input))
        );
    } catch (e) {
        return 0;
    }
};

export default parse;
