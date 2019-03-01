import typescript from "rollup-plugin-typescript";

export default [
  {
    input: "src/tgx.ts",
    plugins: [typescript()],
    output: [
      {
        format: "umd",
        name: "TGXLoader",
        file: "build/tgx-loader.js"
      },
      {
        format: "es",
        file: "build/tgx-loader.module.js"
      }
    ]
  },
  {
    input: "src/test.ts",
    plugins: [typescript()],
    output: [
      {
        format: "cjs",
        file: "build/test.js"
      }
    ]
  }
];
