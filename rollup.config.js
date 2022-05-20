import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

const babelConfig = {
    babelrc: false,
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/plugin-proposal-class-properties']
};

export default [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [postcss({ extract: true }), babel(babelConfig)]
    },
    {
        input: 'lib/components.js',
        output: {
            file: 'dist/components.js',
            format: 'cjs'
        },
        plugins: [babel(babelConfig)]
    },
    {
        input: 'lib/components.js',
        output: {
            file: 'dist/components.esm.js',
            format: 'esm'
        },
        plugins: [babel(babelConfig)]
    }
];
