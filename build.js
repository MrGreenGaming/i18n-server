/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs-extra');
const childProcess = require('child_process');

try {
    // Remove current build
    fs.removeSync('./dist/');

    // Transpile the typescript files
    const proc = childProcess.exec('tsc --build tsconfig.prod.json --verbose');
    proc.on('close', (code) => {
        if (code !== 0) {
            throw Error('Build failed');
        }
    });
    proc.stdout.on('data', (d) => console.log(d.toString()));
} catch (err) {
    console.log(err);
}
