class JsonParseError extends Error {
    readonly _tag = "JsonParseError";
    constructor(_?: unknown) {
        super("Could not parse JSON");
        this.name = this.constructor.name;
    }
}

class NoInputError extends Error {
    readonly _tag = "NoInputError";
    constructor(_?: unknown) {
        super("No input provided");
        this.name = this.constructor.name;
    }
}

class InvalidAssignmentError extends Error {
    readonly _tag = "InvalidAssignmentError";
    constructor(_?: unknown) {
        super("Invalid assignment number");
        this.name = this.constructor.name;
    }
}

export { JsonParseError, NoInputError, InvalidAssignmentError };
