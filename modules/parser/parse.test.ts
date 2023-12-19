import { expect, test, describe } from "bun:test";
import { Effect } from "effect";
import parse from "./parse";

const basePlus = (file: string) => `modules/parser/test-logs/${file}`;

describe("Parsing", () => {
    test("A1", async () => {
        // Should be 1 failed
        const testInput = await Bun.file(basePlus("A1.txt")).text();
        const res = Effect.runSync(parse(testInput));
        expect(res).toBe(96);
    });
});
