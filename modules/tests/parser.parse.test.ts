import { expect, test, describe } from "bun:test";
import { Effect } from "effect";
import parse from "../parser/parse";
import { basePath_ } from "./helpers";

describe("Parsing", () => {
    test("A1 Correctly Parses 1", async () => {
        // Should be 1 failed out of 27 total
        const testInput = await Bun.file(basePath_("A1-correct-1.json")).text();
        const res = Effect.runSync(parse(testInput));
        expect(res).toBe(96);
    });

    test("A1 Correctly Parses 2", async () => {
        // Should be 21 passed out of 27 total
        const testInput = await Bun.file(basePath_("A1-correct-2.json")).text();
        const res = Effect.runSync(parse(testInput));
        expect(res).toBe(78);
    });

    test("A1 Correctly Throws 1", async () => {
        // Test case missing numPassedTests; should throw a JSONParseError.
        const testInput = await Bun.file(basePath_("A1-invalid-1.json")).text();
        try {
            Effect.runSync(parse(testInput));
            // Should not reach this line.
            expect(true).toBe(false);
        } catch (e) {
            // Should reach this line.
            expect(e).not.toBe(undefined);
        }
    });
});
