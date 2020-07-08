import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND } from 'http-status-codes';
import { Translations } from '../managers';

export default async function ProjectMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    let errorMessage = '';
    if (req.params.project) {
        try {
            const project = Translations.getProject(req.params.project);
            res.locals.project = project;
            next();
            return;
        } catch (e) {
            errorMessage = e;
        }
    }

    res.status(NOT_FOUND).end(`Project not found: ${errorMessage}`);
    return;
}
