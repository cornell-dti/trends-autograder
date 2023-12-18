// prevents TS errors
declare var self: Worker;

import parse from "./parser/parse";
const { exec } = require("child_process");

export type Data = {
    assignmentNum: string;
    criticalFile: string;
    netID: string;
};

export type OutputtedData =
    | {
          state: "success";
          netID: string;
          grade: number;
      }
    | {
          state: "failure";
          error: string;
      };

self.onmessage = async (event: MessageEvent) => {
    const { assignmentNum, criticalFile, netID }: Data = event.data;

    console.log("Worker " + netID + " started.");

    try {
        // copy contents of solutions/[assignmentNum] to inside tmp/[netID]
        const first = Bun.spawn([
            `cp`,
            `-r`,
            `solutions/${assignmentNum}/`,
            `tmp/${netID}`,
        ]);
        await first.exited;

        // copy critical file to tmp/[netID]
        const second = Bun.spawn([
            `cp`,
            `Submissions/${netID}/${criticalFile}`,
            `tmp/${netID}/${criticalFile}`,
        ]);
        await second.exited;

        // run `bun install` in tmp/[netID]
        const third = Bun.spawn([`bun`, `install`], {
            cwd: `tmp/${netID}`,
        });
        await third.exited;
    } catch (error) {
        postMessage({ error });
        return;
    }

    // run `bun test .` in tmp/[netID] and parse the output, posting it back to the main thread
    exec(
        `cd tmp/${netID} && bun test .`,
        async (error: any, stdout: string, stderr: string) => {
            if (error) {
                console.log(`Worker ${netID} error: ` + error.message);
                postMessage({ error: error.message });
            }

            const logs = stdout + stderr;

            await Bun.write(`tmp/${netID}/logs.txt`, logs);

            const grade = parse(logs);

            console.log("Worker " + netID + " got grade " + grade);

            postMessage({ netID, grade });
        }
    );
};
