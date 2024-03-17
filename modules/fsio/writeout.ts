import { Effect } from "effect";
import { OUTPUT_FILE } from "../constants";

export type GradebookEntry = readonly [string, string, string];
export type Gradebook = GradebookEntry[];

const write = async (grades: Gradebook, assignmentNum: number) =>
    await Bun.write(
        OUTPUT_FILE,
        new Blob(
            [
                `NetID,Assignment ${assignmentNum},Total,Adjustments,Add Comments\n`,
                ...grades.map(
                    ([netID, grade, comment]) =>
                        `${netID},${grade},${grade},,${comment}\n`
                ),
            ],
            { type: "text/csv" }
        )
    );

/**
 * Writes the grades to a CSV file.
 * @param grades A Gradebook.
 * @returns An Effect that resolves once the grades have been written to a CSV file.
 */
export const writeGrades = (grades: Gradebook, assignmentNum: number) =>
    Effect.promise(() => write(grades, assignmentNum));
