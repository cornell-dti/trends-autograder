// prevents TS errors
declare var self: Worker;

import parse from "./parser/parse";
import { Effect } from "effect";
const { exec } = require("child_process");

export type Data = {
    assignmentNum: string;
    criticalFile: string;
    netID: string;
};

export type OutputtedGrades = {
    netID: string;
    grade: number;
};

/*
- Create the directory /tmp/[NetID].
 *    - Copy the contents of the answer repo into the temporary directory /tmp/[NetID]: pnpm dlx degit cornell-dti/trends-mono/frontend-hw-${assignmentNumber}-solution tmp/${NetID}
 *    - Copy the student's critical file (which should be the only file in the submission folder) into the temporary directory /tmp/[NetID] (overwriting the answer repo's critical file).
 *    - Run `pnpm install` in the temporary directory /tmp/[NetID]
 *    - Run `yes q | pnpm test` in the temporary directory /tmp/[NetID] and save the output as `output`.
 *    - Invoke the parser module with `output` as the argument and save the result as `grade`.
 *    - Append the mapping of `NetID` to `grade` to `OutputtedGrades`.
*/

self.onmessage = async (event: MessageEvent) => {
    const { assignmentNum, criticalFile, netID }: Data = event.data;

    console.log(`Worker ${netID} started`);

    // copy contents of solutions/[assignmentNum] to inside tmp/[netID]
    const first = Bun.spawn([
        `cp`,
        `-r`,
        `solutions/${assignmentNum}/`,
        `tmp/${netID}`,
    ]);
    await first.exited;

    const second = Bun.spawn([
        `cp`,
        `Submissions/${netID}/${criticalFile}`,
        `tmp/${netID}/${criticalFile}`,
    ]);
    await second.exited;

    const third = Bun.spawn([`bun`, `install`], {
        cwd: `tmp/${netID}`,
    });
    await third.exited;

    console.log(`Worker ${netID} finished setup`);

    exec(
        `cd tmp/${netID} && bun test .`,
        async (error: any, stdout: string, stderr: string) => {
            console.log(`Worker ${netID} finishing test`);

            if (error) {
                console.log(`Worker ${netID} error: ` + error.message);
            }

            const logs = stdout + stderr;

            await Bun.write(`tmp/${netID}/logs.txt`, logs);

            const grade = parse(logs);

            console.log(`Worker ${netID} got grade: ` + grade);

            postMessage({ netID, grade });

            process.exit();
        }
    );
};
