import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "src/index.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [typescript()],
  external: [
    "@crud-studio/react-crud-core",
    "@emotion/react",
    "@emotion/styled",
    "@lottiefiles/react-lottie-player",
    "@material-ui/core",
    "@material-ui/icons",
    "@material-ui/lab",
    "copy-to-clipboard",
    "events",
    "lodash",
    "mousetrap",
    "react",
    "react-dom",
    "react-dropzone",
    "react-hook-form",
    "react-intl",
    "react-merge-refs",
    "react-router-dom",
    "react-use",
    "react-virtualized-auto-sizer",
    "react-window",
    "type-fest",
    "uuid",
    "xlsx",
  ],
};
