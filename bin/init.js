/*
 * @Author: fangt11
 * @Date:   2022-03-07 12:15:50
 * @Last Modified by:   fangt11
 * @Last Modified time: 2022-03-07 14:19:46
 */
const { readFileSync, writeFileSync } = require('fs');
const { copySync } = require('fs-extra');

copySync('node_modules/@ke/table/dist/Render.esm.js', 'lib/Render.js');

writeFileSync(
    './lib/v3.js',
    readFileSync('./lib/index.js')
        .toString()
        .replace(`import { Form } from 'antd';`, `import Form from './form/index';`)
);
