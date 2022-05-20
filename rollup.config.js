import babel from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'lib/index.jsx',
    output: {
        file: 'dist/index.js',
        format: 'cjs',
        exports: 'default'
    },
    external: id => {
        return !['.', '/'].some(v => id.startsWith(v));
    },
    plugins: [
        postcss({ extract: true }),
        babel({
            babelrc: false,
            babelHelpers: 'bundled',
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
        })
    ]
};
