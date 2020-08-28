import { Request, Response, NextFunction } from 'express';

export default async function SecretKeyMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.body.secret || typeof req.body.secret !== 'string') {
        next(new Error('No secret key specified'));
        return;
    } else if (req.body.secret !== process.env.GH_WEBHOOK_SECRET) {
        next(new Error('Invalid secret key'));
        return;
    }
    next();
}
