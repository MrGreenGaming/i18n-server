import { RequestHandler, NextFunction, Request, Response } from 'express';

// Wrapper Function
export const asyncWrapper = (action: RequestHandler) => {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await action(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
