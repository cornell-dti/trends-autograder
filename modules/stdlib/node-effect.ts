/**
 * @module stdlib/node-effect
 * Similar to bun-effect, but for (polyfilled, anyway) Node.js APIs.
 */

import { Effect } from "effect";

const { exec } = require("child_process");

/**
 * Execute a command as an Effect.
 * @param command A command.
 * @param callback A callback, optional.
 * @returns An Effect that resolves once the command has exited.
 */
export const nodeExec = (command: string) =>
    Effect.async<never, Error, { stdout: string; stderr: string }>((resume) => {
        exec(command, (error: any, stdout: string, stderr: string) => {
            if (error) {
                resume(Effect.fail(error));
            } else {
                resume(Effect.succeed({ stdout, stderr }));
            }
        });
    });
