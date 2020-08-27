import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED, BAD_REQUEST, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import * as crypto from 'crypto';

export default async function GithubMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.headers['x-hub-signature']) {
        res.status(UNAUTHORIZED).end();
        return;
    }
    if (!req.body.repository?.owner?.name && req.body?.repository?.name) {
        res.status(UNPROCESSABLE_ENTITY).end();
        return;
    }
    const signature = req.headers['x-hub-signature'] as string;
    const payload = JSON.stringify(req.body);
    if (!payload) {
        res.status(BAD_REQUEST).end();
        return;
    }
    const hmac = crypto.createHmac('sha1', process.env.GH_SECRET as string);
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        res.status(UNAUTHORIZED).end();
    }
    next();
}
