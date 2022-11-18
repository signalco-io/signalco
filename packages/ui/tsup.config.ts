import type { Options } from 'tsup';

const env = process.env.NODE_ENV;

export const tsup: Options = {
   clean: true, // clean up the dist folder
//   dts: true, // generate dts files
  format: ['esm'], // generate cjs and esm files
//   minify: env === 'production',
//   bundle: env === 'production',
//   skipNodeModulesBundle: true,
//   entryPoints: ['src/index.tsx'],
//   watch: env === 'development',
  target: 'es2020',
  external: ['react', 'react-dom'],
//   outDir: env === 'production' ? 'dist' : 'lib',
  entry: ['src/**/*.ts?(x)'], //include all files under src
};
