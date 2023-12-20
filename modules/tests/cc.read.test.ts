import { expect, test, describe } from "bun:test";
import readLogs from "../cc/read";
import { Effect } from "effect";
import { basePath_ } from "./helpers";

describe("Reading", () => {
    test("First A1 Test Case Works", async () => {
        // Should be [testID1, 96]
        const res = await Effect.runPromise(
            readLogs("testID1", basePath_("A1-correct-1.json"))
        );
        expect(res).toEqual(["testID1", "96"]);
    });

    test("Second A1 Test Case Works", async () => {
        // Should be [testID2, 78]
        const res = await Effect.runPromise(
            readLogs("testID2", basePath_("A1-correct-2.json"))
        );
        expect(res).toEqual(["testID2", "78"]);
    });

    test("Third A1 Test Case Fails", async () => {
        // Should be [testID3, ERROR]
        const res = await Effect.runPromise(
            readLogs("testID3", basePath_("A1-invalid-1.json"))
        );
        expect(res).toEqual(["testID3", "ERROR"]);
    });

    test("Nonexistent A1 Test Case Fails", async () => {
        // Should be [testID4, ERROR]
        const res = await Effect.runPromise(
            readLogs("testID4", basePath_("i-dont-exist.json"))
        );
        expect(res).toEqual(["testID4", "ERROR"]);
    });
});
