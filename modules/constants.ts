export const assignments: [string, string, string, string] = [
    "A1",
    "A2",
    "A3",
    "A4",
];

export const criticalFiles: {
    [key: string]: string;
} = {
    A1: "main.js",
    A2: "src/main.ts",
    A3: "src/Paginator.tsx",
    A4: "src/components/Gallery.tsx",
};

export const tempFolder = "tmp/";

export const submissionsFolder = "Submissions/";

export const defaultGradeIfSyntaxError = 70;

export const lowestPossibleGrade = 70;
