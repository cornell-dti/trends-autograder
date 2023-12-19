/**
 * The assignments that are available.
 */
export const assignments: [string, string, string, string] = [
    "A1",
    "A2",
    "A3",
    "A4",
];

/**
 * The files that are critical to each assignment.
 */
export const criticalFiles: {
    [key: string]: string;
} = {
    A1: "main.js",
    A2: "src/main.ts",
    A3: "src/Paginator.tsx",
    A4: "src/components/Gallery.tsx",
};

/**
 * No single execution of a shell command should take longer than this.
 */
export const maxCmdTimeout = 30000;
