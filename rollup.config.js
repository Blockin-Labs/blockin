import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import replace from 'rollup-plugin-replace';
import css from 'rollup-plugin-import-css';
import dts from 'rollup-plugin-dts';

const packageJson = require('./package.json');

export default {
    input: 'src/components/index.ts',
    output: [
        {
            file: 'dist/components/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/components/index.es.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        replace({
            include: 'node_modules/js-sha256/src/sha256.js',
            values: {
                'eval(': '[eval][0](',
            },
        }),
        peerDepsExternal(),
        resolve({ browser: true }),
        commonjs(),
        json(),
        typescript({ tsconfig: './tsconfig.json' }),
        css(),
    ],
};
