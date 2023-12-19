import { Effect } from "effect";

export type Gradebook = { [netID: string]: number };

const write = async (grades: Gradebook) => {
    console.log("Writing grades to CSV file...");

    const csv = new Blob(
        [
            "NetID,A1,Total,Adjustments,Add Comments\n",
            ...Object.entries(grades)
                .sort(([netID1], [netID2]) => netID1.localeCompare(netID2))
                .map(([netID, grade]) => `${netID},${grade},${grade},,\n`),
        ],
        { type: "text/csv" }
    );

    await Bun.write("cms.csv", csv);
};

/**
 * Writes the grades to a CSV file.
 * @param grades An object mapping netIDs to grades.
 * @returns An Effect that resolves once the grades have been written to a CSV file.
 */
export const writeGrades = (grades: Gradebook) =>
    Effect.promise(() => write(grades));
