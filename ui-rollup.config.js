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
    input: 'src/ui/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'esm',
            name: 'blockin-ui',
            sourcemap: true,
        },
        {
            file: 'dist/index.cjs',
            format: 'cjs',
            name: 'blockin-ui',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve({ browser: true }),
        commonjs(),
        typescript({ tsconfig: './ui-tsconfig.json' }),
        postcss(),
        json(),

        //If anything else is added to here, also confirm the postuirollup script in package.json handles it
        // copy({
        //     targets: [
        //         {
        //             src: 'src/ui/variables.scss',
        //             dest: 'dist/',
        //             rename: 'variables.scss',
        //         },
        //         {
        //             src: 'src/ui/typography.scss',
        //             dest: 'dist/',
        //             rename: 'typography.scss',
        //         },
        //         {
        //             src: 'src/ui/blockin.scss',
        //             dest: 'dist/',
        //             rename: 'blockin.scss',
        //         },
        //     ],
        // }),
    ],
};
