/*
 * @Author: fangt11
 * @Date:   2022-03-07 12:15:50
 * @Last Modified by:   fangt11
 * @Last Modified time: 2022-03-07 14:22:41
 */
const { readFileSync, writeFileSync } = require('fs');

writeFileSync(
    './lib/v3.js',
    readFileSync('./lib/index.js')
        .toString()
        .replace(`import { Form } from 'antd';`, `import Form from './form/index';`)
);
