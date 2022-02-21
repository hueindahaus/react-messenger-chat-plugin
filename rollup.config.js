/*
import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import external from "rollup-plugin-peer-deps-external";
*/
import typescript from "@rollup/plugin-typescript";

export default [
  {
    input: "./src/index.ts",
    output: [{ dir: "dist", format: "es" }],
    plugins: [
      typescript({ module: "ESNext", tsconfig: "./tsconfig.json" }),
      /*
      babel({
        exclude: "node_modules/**",
        presets: ["@babel/preset-react"],
      }),
      external(),
      resolve(),
      terser(),
      */
    ],
    external: ["react"],
  },
];
