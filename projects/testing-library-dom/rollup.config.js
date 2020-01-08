import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';

export default [
    {
        input: require.resolve(
            '@sheerun/mutationobserver-shim/MutationObserver.js'
        ),
        output: {
            file: './lib/mutationobserver-shim/index.js',
            format: 'es',
        },
        plugins: [
            resolve({
                browser: true,
                preferBuiltins: false,
            }),
            commonjs(),
        ],
    },
    {
        input: require.resolve(
            '@testing-library/dom/dist/@testing-library/dom.esm.js'
        ),
        output: {
            file: './dom.js',
            format: 'es',
        },
        plugins: [
            alias({
                entries: {
                    '@sheerun/mutationobserver-shim':
                        'lib/mutationobserver-shim/index.js',
                },
            }),
            resolve({
                browser: true,
                preferBuiltins: false,
            }),
            commonjs(),
            replace({
                querySelectorAll: 'querySelectorAllWithShadowDOM',
                'process.env.DEBUG_PRINT_LIMIT':
                    "(typeof process !== 'undefined' && process.env.DEBUG_PRINT_LIMIT)",
                'htmlElement.outerHTML.length > maxLength':
                    '(htmlElement.outerHTML && htmlElement.outerHTML.length > maxLength)',
            }),
        ],
    },
];
