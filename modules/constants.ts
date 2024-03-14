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
    A2: "main.ts",
    A3: "Paginator.tsx",
    A4: "Gallery.tsx",
};

/**
 * No single effect should take longer than this.
 */
export const maxTimeout = "30 seconds";

/**
 * Message to write into cms.csv for students who we had trouble auto-grading.
 * Indicates you should hand-grade those students.
 */
export const ERROR = "ERROR";

/**
 * Output file name (should end in .csv)
 */
export const OUTPUT_FILE = "cms.csv";

/**
 * The directory where the student submissions are stored.
 */
export const SUBMISSIONS_DIR = "Submissions";

/**
 * The directory where the solutions are stored.
 */
export const SOLUTIONS_DIR = "solutions";

/**
 * The directory where the temporary build files are stored.
 */
export const TMP_DIR = "tmp";
