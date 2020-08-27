import './LoadEnv'; // Must be the first import
import * as managers from './managers'; // Import all managers
import Server from './Server';
import BaseManager from './managers/base';
import fs from 'fs-extra';

// Start the server
async function start() {
    // Make sure the files folder is present and empty
    await fs.ensureDir(`${process.cwd()}/files`);
    await fs.emptyDir(`${process.cwd()}/files`);
    // Initialise the managers
    for (const name in managers) {
        if (managers.hasOwnProperty(name)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const manager: BaseManager = (managers as any)[name];
            await manager.init();
        }
    }

    // Start the server
    const server = new Server();
    server.start(3000);
}
start();
