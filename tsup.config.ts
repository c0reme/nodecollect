import { esbuildPluginVersionInjector } from "esbuild-plugin-version-injector";
import { relative, resolve } from "path";
import { defineConfig } from "tsup";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  minify: false,
  sourcemap: true,
  target: "es2022",
  tsconfig: relative(__dirname, resolve(process.cwd(), "src", "tsconfig.json")),
  keepNames: true,
  esbuildPlugins: [esbuildPluginVersionInjector()]
});
