import { Request, Response, NextFunction } from 'express';

export default async function ExtractMiddleware(req: ExtractRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.body.name || typeof req.body.name !== 'string') {
        next(new Error('Repository name ({name: ...}) not specified in body.'));
        return;
    } else if (!req.body.owner || typeof req.body.owner !== 'string') {
        next(new Error('Repository owner ({owner: ...}) not specified in body'));
        return;
    }

    req.repoName = req.body.name;
    req.repoOwner = req.body.owner;
    next();
}

export interface ExtractRequest extends Request {
    repoName?: string;
    repoOwner?: string;
}
