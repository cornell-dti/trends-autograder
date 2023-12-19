/**
 * @module stdlib/helpers
 * Aims to provide useful, context-agnostic helper functions.
 */

/**
 * Split a string into tokens by any amount of whitespace.
 * @param input A string.
 * @returns An array of strings.
 */
export const tokenize = (input: string): string[] =>
    input.split(/\s+/).filter((token) => token.length > 0);
