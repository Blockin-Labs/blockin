/**
 * As a build hack, we run mv ./dist/index* ./dist/*.scss ./dist/ui after building this rollup
 * in order to have correct directory structure for the types in dist/ui.
 */

import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ browser: true }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({
      inject: false
    }),
    json(),
    //If anything else is added to here, also confirm the postrollup script in package.json handles it
    copy()
  ],
  globals: {
    react: 'React'
  },

  //use external react
  external: ['react', 'react-dom']
};
