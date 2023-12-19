import { Effect } from "effect";

export type Gradebook = (readonly [string, string])[];

const write = async (grades: Gradebook) =>
    await Bun.write(
        "cms.csv",
        new Blob(
            [
                "NetID,A1,Total,Adjustments,Add Comments\n",
                ...grades.map(
                    ([netID, grade]) => `${netID},${grade},${grade},,\n`
                ),
            ],
            { type: "text/csv" }
        )
    );

/**
 * Writes the grades to a CSV file.
 * @param grades An object mapping netIDs to grades.
 * @returns An Effect that resolves once the grades have been written to a CSV file.
 */
export const writeGrades = (grades: Gradebook) =>
    Effect.promise(() => write(grades));
