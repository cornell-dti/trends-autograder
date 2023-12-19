/**
 * @module stdlib/bun-effect
 * Aims to provide a functional, Effect-ful interface for some standard Bun operations.
 */

import { Effect } from "effect";
import { tokenize } from "./fns";

/**
 * Get the first element of an async iterable.
 */
const getFirstElement = async <T>(
    asyncIterable: AsyncIterable<T>
): Promise<T | undefined> => {
    for await (const element of asyncIterable) {
        return element;
    }
};

/**
 * Get the first element of an async iterable as an Effect.
 * @param iterable An async iterable.
 * @returns An Effect that resolves to the first element of the async iterable.
 */
export const bunReadLine = () =>
    Effect.promise<string | undefined>(() => getFirstElement(console));

/**
 * Execute a command.
 */
const exec = async (command: string[]) => {
    const proc = Bun.spawn(command);
    await proc.exited;

    const { stdout, stderr, exited } = proc;
    const consoleOutput = await new Response(stdout).text();
    const consoleErrors = await new Response(stderr).text();

    return [consoleOutput, consoleErrors] as const;
};

/**
 * Execute a command as an Effect.
 * @param command A command.
 * @returns An Effect that resolves once the command has exited.
 */
export const bunExec = (command: string[]) =>
    Effect.promise(() => exec(command));

/**
 * Write to a file.
 */
const write = async (filename: string, contents: string | Blob) => {
    await Bun.write(filename, contents);
};

/**
 * Write to a file as an Effect.
 * @param filename A filename.
 * @param contents The contents of the file.
 * @returns An Effect that resolves once the file has been written.
 */
export const bunWrite = (filename: string, contents: string | Blob) =>
    Effect.promise(() => write(filename, contents));

/**
 * Get contents of a directory as a string[].
 * @param directory A directory path.
 * @returns A string[] of the contents of the directory.
 */
export const bunLs = (directory: string) =>
    Effect.gen(function* ($) {
        const [stdout, _] = yield* $(bunExec(["ls", directory]));
        return tokenize(stdout);
    });

/**
 * Write something to console.
 * @param message A message to write to console.
 * @returns An Effect that resolves once the message has been written to console.
 */
export const bunLog = (message: string) =>
    Effect.sync(() => process.stdout.write(message));
