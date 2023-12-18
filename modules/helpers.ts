export const tokenize = (input: string): string[] =>
    input.split(/\s+/).filter((token) => token.length > 0);

export const removeUndefinedEntries = (obj: Record<string, any>) => {
    Object.keys(obj).forEach((key) => {
        if (key === "undefined" || obj[key] === undefined) {
            delete obj[key];
        }
    });
};
