import { Effect } from "effect";
import runMain from "./modules/cc/main";

await Effect.runPromiseExit(runMain());
