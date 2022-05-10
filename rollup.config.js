import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';

export default {
    input: 'src/components/index.ts',
    output: [
        {
            file: 'dist/ui/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/ui/index.es.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.rollup.json' }),
        postcss(),
        json(),
        copy({
            targets: [
                {
                    src: 'src/components/variables.scss',
                    dest: 'dist/ui/',
                    rename: 'variables.scss',
                },
                {
                    src: 'src/components/typography.scss',
                    dest: 'dist/ui/',
                    rename: 'typography.scss',
                },
            ],
        }),
    ],
};
