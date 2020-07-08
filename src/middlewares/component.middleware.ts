import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND } from 'http-status-codes';
import { Translations } from '../managers';

export default async function ProjectMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    let errorMessage = '';
    if (req.params.component) {
        try {
            const component = Translations.getComponent(req.params.project, req.params.component);
            res.locals.component = component;
            next();
            return;
        } catch (e) {
            errorMessage = e;
        }
    }

    res.status(NOT_FOUND).end(`Component not found: ${errorMessage}`);
    return;
}
