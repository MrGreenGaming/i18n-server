import './LoadEnv'; // Must be the first import
import * as managers from './managers'; // Import all managers
import Server from './Server';
import BaseManager from './managers/base';

// Start the server
async function start() {
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
    server.start(Number.parseInt(<string>process.env.PORT, 10));
}
start();
