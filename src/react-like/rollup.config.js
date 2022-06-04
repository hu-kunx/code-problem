import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  output: [
    {
      name: "Keep",
      file: "lib/bundle.js",
      format: "iife",
    },
    {
      format: "es",
      file: "lib/bundle.esm.js"
    }
  ],
  plugins: [
    typescript( { exclude: "node_modules/**" } )
  ]
}
