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
 * The file paths that are critical to each assignment.
 */
export const criticalFilePaths: {
    [key: string]: string;
} = {
    A1: "main.js",
    A2: "src/main.ts",
    A3: "src/Paginator.tsx",
    A4: "src/components/Gallery.tsx",
};

/**
 * No single effect should take longer than this.
 */
export const maxTimeout = "3 minutes";

/**
 * Do not allow more than this many effects to run concurrently.
 */
export const maxConcurrency = 10;

/**
 * Message to write into cms.csv for students who we had trouble auto-grading.
 * i.e. if their code has such a serious issue it doesn't even compile.
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
