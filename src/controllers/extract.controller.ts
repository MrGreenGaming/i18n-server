import { Response } from 'express';
import { Controller, Middleware, ClassErrorMiddleware, ClassWrapper, Post } from '@overnightjs/core';

import { Extraction } from '../managers';
import { OK } from 'http-status-codes';
import errorMiddleware from '../middlewares/error.middleware';
import { asyncWrapper } from '../shared/AsyncWrapper';
import ExtractMiddleware, { ExtractRequest } from '../middlewares/extract.middleware';
import SecretKeyMiddleware from '../middlewares/secretkey.middleware';

@Controller('extract')
@ClassWrapper(asyncWrapper)
@ClassErrorMiddleware(errorMiddleware)
export class ExtractController {
    @Post('')
    @Middleware([SecretKeyMiddleware, ExtractMiddleware])
    private async extractRepo(req: ExtractRequest, res: Response) {
        const repo = Extraction.getExtractionRepository(req.repoOwner as string, req.repoName as string);
        await Extraction.extractAndPush(repo);
        res.status(OK).json({ message: `${req.repoOwner}/${req.repoName} has been extracted!` });
    }
}
