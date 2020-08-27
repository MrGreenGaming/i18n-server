import { Request, Response } from 'express';
import { Controller, Post, Middleware, ClassErrorMiddleware, ClassWrapper } from '@overnightjs/core';
import { OK } from 'http-status-codes';
import GithubMiddleware from '../middlewares/github.middleware';
import { GithubWebhookPushPayload, Extraction } from '../managers/extractions.manager';
import errorMiddleware from '../middlewares/error.middleware';
import { asyncWrapper } from '../shared/AsyncWrapper';

@Controller('github')
@ClassWrapper(asyncWrapper)
@ClassErrorMiddleware(errorMiddleware)
export class GithubController {
    @Post('')
    @Middleware(GithubMiddleware)
    private async githubWebhook(req: Request, res: Response) {
        await Extraction.extractFromPayload(req.body as GithubWebhookPushPayload);
        res.status(OK);
    }
}
