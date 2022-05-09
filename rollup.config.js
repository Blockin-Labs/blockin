import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
// import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';

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
        peerDepsExternal(),
        resolve({ browser: true }),
        commonjs(),
        json(),
        typescript({ useTsconfigDeclarationDir: true }),
        // postcss(),
    ],
};
