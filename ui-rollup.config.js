/**
 * As a build hack, we run mv ./dist/index* ./dist/*.scss ./dist/ui after building this rollup
 * in order to have correct directory structure for the types in dist/ui.
 */

import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';

export default {
  input: 'src/ui/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      name: 'blockin-ui',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      name: 'blockin-ui',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './ui-tsconfig.json' }),
    postcss({
      inject: true
    }),
    json()
  ],
  globals: {
    react: 'React'
  },
  external: ['react', 'react-dom']
};
