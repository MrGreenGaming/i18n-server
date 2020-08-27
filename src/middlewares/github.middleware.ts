import { Request, Response, NextFunction } from 'express';
import { UNAUTHORIZED, BAD_REQUEST, UNPROCESSABLE_ENTITY, OK } from 'http-status-codes';
import * as crypto from 'crypto';
import logger from '../shared/Logger';

export default async function GithubMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.headers['x-github-event']) {
            res.status(UNPROCESSABLE_ENTITY).json({ error: 'No event specified' }).end();
            return;
        }

        const payload = JSON.stringify(req.body);
        if (!payload) {
            res.status(BAD_REQUEST).end();
            return;
        }

        if (!req.headers['x-hub-signature']) {
            res.status(UNAUTHORIZED).json({ error: 'Missing signature' }).end();
            return;
        }
        const signature = req.headers['x-hub-signature'] as string;
        const validSignature = isValidSignature(signature, payload);
        if (validSignature) {
            res.status(UNAUTHORIZED).json({ error: 'Invalid signature' }).end();
        }
        // OK for ping event
        if (req.headers['x-github-event'] == 'ping') {
            res.status(OK).end();
            return;
        } else if (!req.body.repository?.owner?.name && req.body?.repository?.name) {
            res.status(UNPROCESSABLE_ENTITY).json({ error: 'Could not get repository owner/name from body' }).end();
            return;
        }

        next();
    } catch (e) {
        console.log(e);
        logger.error(e);
        next(e);
    }
}

function isValidSignature(signature: string, payload: string) {
    const hmac = crypto.createHmac('sha1', process.env.GH_WEBHOOK_SECRET as string);
    const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
    const checksum = Buffer.from(signature, 'utf8');
    if (checksum.length !== digest.length || !crypto.timingSafeEqual(digest, checksum)) {
        return false;
    }
    return true;
}
