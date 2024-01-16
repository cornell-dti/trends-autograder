/**
 * @module stdlib/helpers
 * Aims to provide useful, context-agnostic helper functions. Not Effect-ful.
 */

/**
 * Split a string into tokens by any amount of whitespace.
 * @param input A string.
 * @returns An array of strings.
 */
export const tokenize = (input: string): string[] =>
    input.split(/\s+/).filter((token) => token.length > 0);

/**
 * Get the file name from the file path.
 */
export const getFileName = (filePath: string): string =>
    filePath.split("/").pop()!;
