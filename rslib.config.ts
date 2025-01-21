import { defineConfig } from '@rslib/core';
import { version } from "./package.json";

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
    {
      format: 'cjs',
      syntax: 'es2021',
    },
  ],
  source: {
    define: {
      'process.env.PACKAGE_VERSION': JSON.stringify(version),
    }
  }
});
