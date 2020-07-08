import * as bodyParser from 'body-parser';
import * as routes from './controllers';
import { Server } from '@overnightjs/core';
import logger from './shared/Logger';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import { NOT_FOUND } from 'http-status-codes';

class WebServer extends Server {
    private readonly SERVER_STARTED = 'Server started on port: ';

    constructor() {
        super(true);

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));

        // Show routes called in console during development
        if (process.env.NODE_ENV === 'development') {
            this.app.use(morgan('dev'));
        }

        // Security
        if (process.env.NODE_ENV === 'production') {
            this.app.use(helmet());
        }

        this.setupControllers();
    }

    private setupControllers(): void {
        const routeInstances = [];
        for (const name in routes) {
            if (routes.hasOwnProperty(name)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const controller = (routes as any)[name];
                routeInstances.push(new controller());
            }
        }
        super.addControllers(routeInstances);
    }

    public start(port: number): void {
        this.app.get('*', (req, res) => {
            res.status(NOT_FOUND).end();
        });
        this.app.listen(port, () => {
            logger.info(this.SERVER_STARTED + port);
        });
    }
}

export default WebServer;
