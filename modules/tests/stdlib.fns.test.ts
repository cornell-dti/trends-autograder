import { expect, test, describe } from "bun:test";
import { tokenize } from "../stdlib/fns";

describe("Tokenizing", () => {
    test("Tokenizes a basic string", () => {
        const res = tokenize("Hello, world!");
        expect(res).toEqual(["Hello,", "world!"]);
    });

    test("Tokenizes a string with multiple spaces", () => {
        const res = tokenize("Hello,   world!");
        expect(res).toEqual(["Hello,", "world!"]);
    });

    test("Tokenizes a string with tabs", () => {
        const res = tokenize("Hello,\tworld!");
        expect(res).toEqual(["Hello,", "world!"]);
    });

    test("Tokenizes a string with newlines", () => {
        const res = tokenize("Hello,\nworld!");
        expect(res).toEqual(["Hello,", "world!"]);
    });

    test("Tokenizes a string with mixed whitespace", () => {
        const res = tokenize("Hello,\n\t world!");
        expect(res).toEqual(["Hello,", "world!"]);
    });
});
