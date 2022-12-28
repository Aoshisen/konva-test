import typescript from "@rollup/plugin-typescript";
import {nodeResolve} from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";
import html from "@rollup/plugin-html";
import livereload from "rollup-plugin-livereload";
import nodePolyfills from "rollup-plugin-polyfill-node";
import commonjs from "@rollup/plugin-commonjs";
export default {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
    format: "es",
  },

  plugins: [
    nodeResolve({
      exportConditions:['default','module',"import"]
    }),
    commonjs({
      esmExternals:true,
      include:/node_modules/
    }),
    html(),
    typescript(),
    serve("dist"),
    livereload(),
    nodePolyfills(/* options */),
  ],
};
