import { Effect, pipe } from "effect";
import runMain from "./modules/cc/main";
import init from "./modules/fsio/init";

const main = pipe(init(), Effect.flatMap(runMain));
await Effect.runPromiseExit(main);
