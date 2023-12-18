export const tokenize = (input: string): string[] =>
    input.split(/\s+/).filter((token) => token.length > 0);
