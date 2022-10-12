import { defineBuildConfig } from "unbuild";
import Glob from "glob";

export default defineBuildConfig({
  entries: ["src/index", ...Glob.sync("src/antlr_gen/*.ts")],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});
