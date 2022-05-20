import babel from '@rollup/plugin-babel';

export default [
    {
        input: 'lib/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [babel()]
    },
    {
        input: 'lib/v3.js',
        output: {
            file: 'dist/v3.js',
            format: 'cjs',
            exports: 'default'
        },
        plugins: [babel()]
    },
    {
        input: 'lib/components.js',
        output: {
            file: 'dist/components.esm.js',
            format: 'esm'
        },
        plugins: [babel()]
    },
    {
        input: 'lib/form/index.js',
        output: {
            file: 'dist/form.esm.js',
            format: 'esm'
        },
        plugins: [babel()]
    }
];
