import { expect, test, describe } from "bun:test";
import JsonStrToObj from "../stdlib/json";
import { Effect } from "effect";
import { basePath_ } from "./helpers";
import { z } from "zod";

const validSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    url: z.string(),
    cutoff: z.number(),
    average: z.number(),
    public: z.boolean(),
});

const correctFile = Bun.file(basePath_("Sample-correct.json")),
    incorrectFile = Bun.file(basePath_("Sample-incorrect-1.json"));

const correctStr = await correctFile.text(),
    incorrectStr = await incorrectFile.text();

describe("JSON Parsing", () => {
    test("Validates and passes a JSON", async () => {
        const res = Effect.runSync(JsonStrToObj(validSchema)(correctStr));
        expect(res).not.toBe(undefined);
    });

    test("Validates and fails a JSON", async () => {
        try {
            Effect.runSync(JsonStrToObj(validSchema)(incorrectStr));
            // Should not reach here
            expect(true).toBe(false);
        } catch (e) {
            // Should reach here
            expect(e).not.toBe(undefined);
        }
    });
});
