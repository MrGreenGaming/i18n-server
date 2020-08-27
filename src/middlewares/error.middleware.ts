import { NextFunction, Request, Response } from 'express';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
    res.status(INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Internal server error',
        route: req.originalUrl,
    });
}
