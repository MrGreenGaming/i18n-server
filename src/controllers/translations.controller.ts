import { Request, Response } from 'express';
import { Controller, Middleware, Get } from '@overnightjs/core';
import ComponentMiddleware from '../middlewares/component.middleware';
import ProjectMiddleware from '../middlewares/project.middleware';
import { Translations, IProject, IComponent } from '../managers';
import { OK } from 'http-status-codes';

@Controller('')
export class TranslationsController {
    @Get('')
    private getAllProjects(req: Request, res: Response) {
        res.status(OK).json(Translations.getAllProjects());
    }

    @Get(':project')
    @Middleware(ProjectMiddleware)
    private async getProjectInfo(req: Request, res: Response) {
        const project: IProject = res.locals.project;
        res.status(OK).json(project);
    }

    @Get(':project/:component')
    @Middleware([ProjectMiddleware, ComponentMiddleware])
    private async getComponentInfo(req: Request, res: Response) {
        const component: IComponent = res.locals.component;
        res.status(OK).json(component);
    }

    @Get(':project/:component/translations')
    @Middleware([ProjectMiddleware, ComponentMiddleware])
    private async getComponentTranslations(req: Request, res: Response) {
        const project: IProject = res.locals.project;
        const component: IComponent = res.locals.component;
        const translations = await Translations.getComponentTranslations(project.name, component.name);
        res.status(OK).json(translations);
    }
}
