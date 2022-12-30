import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import html from "@rollup/plugin-html";
import livereload from "rollup-plugin-livereload";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-import-css";
export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "es",
  },

  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    css(),
    html(),
    typescript(),
    serve("dist"),
    livereload(),
  ],
};
