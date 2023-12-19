import { expect, test, describe } from "bun:test";
import { Effect } from "effect";
import parse from "./parse";

const basePath_ = (file: string) => `modules/parser/test-logs/${file}`;

describe("Parsing", () => {
    test("A1", async () => {
        // Should be 1 failed out of 27 total
        const testInput = await Bun.file(basePath_("A1.json")).text();
        const res = Effect.runSync(parse(testInput));
        expect(res).toBe(96);
    });
});
