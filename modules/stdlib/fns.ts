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
 * "Races" a provided Promise against a provided timeout. If the timeout is reached first, the Promise is rejected.
 * @param promise The Promise to race against.
 * @param timeoutMs The timeout, in milliseconds.
 * @returns A Promise that resolves to the result of the provided Promise, or rejects with an Error if the timeout is reached first.
 */
export const promiseWithTimeout = <T>(
    promise: Promise<T>,
    timeoutMs: number,
    onTimeout: () => void
): Promise<T> => {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
            onTimeout();
            reject(new Error(`Timed out after ${timeoutMs} ms`));
        }, timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]).finally(() => {
        clearTimeout(timeoutHandle);
    });
};
