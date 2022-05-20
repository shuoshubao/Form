const { copySync } = require('fs-extra');

copySync('node_modules/@ke/table/dist/Render.esm.js', 'lib/Render.js');
