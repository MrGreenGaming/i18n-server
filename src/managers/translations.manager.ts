import BaseManager from './base';
import * as fs from 'fs-extra';
import { Repo } from '.';
import jsonfile from 'jsonfile';
import logger from '../shared/Logger';
import nodeCache from 'node-cache';

class TranslationsManager extends BaseManager {
    private projects: IProject[] = [];
    private refreshIntervalAmount = 5 * 60 * 1000;
    private readonly refreshInterval = setInterval(this.refresh.bind(this), this.refreshIntervalAmount);
    private translationCache = new nodeCache({
        stdTTL: this.refreshIntervalAmount,
        deleteOnExpire: true,
        checkperiod: 120,
    });

    public async init(): Promise<void> {
        await this.refresh();
    }

    public getAllProjects() {
        return [...this.projects];
    }

    public getProjectComponents(projectName: string): IComponent[] {
        const project = [...this.projects].find((v) => v.name === projectName);
        if (!project) throw `Project '${projectName}' does not exist.`;
        return project.components;
    }

    public getComponentLanguages(projectName: string, componentName: string): ILanguage[] {
        const project = [...this.projects].find((v) => v.name === projectName);
        if (!project) throw `Project '${projectName}' does not exist.`;
        const component = project.components.find((v) => v.name === componentName);
        if (!component) throw `Component '${componentName}' does not exist in project '${projectName}'.`;
        return component.languages;
    }

    public async getComponentTranslations(projectName: string, componentName: string) {
        if (this.translationCache.has(`${projectName}-${componentName}`)) {
            return this.translationCache.get(`${projectName}-${componentName}`) as ITranslations;
        }

        const languageFiles = this.getComponentLanguages(projectName, componentName);
        const translations: ITranslations = {};
        for (const langfile of languageFiles) {
            try {
                const json: ITranslation = await jsonfile.readFile(
                    `${Repo.path}/${projectName}/${componentName}/${langfile.file}`,
                );
                translations[langfile.name] = json;
            } catch (e) {
                logger.error(e);
            }
        }
        this.translationCache.set(`${projectName}-${componentName}`, translations);
        return translations;
    }

    public getProject(projectName: string) {
        const project = [...this.projects].find((v) => v.name === projectName);
        if (!project) throw `Project ${projectName} does not exist.`;
        return project;
    }

    public getComponent(project: string | IProject, componentName: string) {
        project = typeof project === 'string' ? this.getProject(project) : project;
        const component = project.components.find((v) => v.name === componentName);
        if (!component) throw `Component ${componentName} does not exist in project ${project.name}.`;
        return component;
    }

    private async refresh() {
        this.projects = await this.cacheAllProjects();
    }

    private async cacheAllProjects(): Promise<IProject[]> {
        const dir = await fs.readdir(Repo.path);
        const projects: IProject[] = [];
        for (const file of dir) {
            const stat = await fs.stat(`${Repo.path}/${file}`);
            if (stat.isDirectory() && file !== '.git') {
                const components = await this.cacheAllProjectComponents(file);
                projects.push({ name: file, components });
            }
        }
        return projects;
    }

    private async cacheAllProjectComponents(projectName: string): Promise<IComponent[]> {
        const projectExists = await fs.pathExists(`${Repo.path}/${projectName}`);
        if (!projectExists) throw `Project "${projectName}" does not exist.`;
        const dir = await fs.readdir(`${Repo.path}/${projectName}`);
        const components: IComponent[] = [];
        for (const file of dir) {
            const stat = await fs.stat(`${Repo.path}/${projectName}/${file}`);
            if (stat.isDirectory()) {
                const languages = await this.cacheAllComponentLanguages(projectName, file);
                components.push({ name: file, languages });
            }
        }
        return components;
    }

    private async cacheAllComponentLanguages(projectName: string, componentName: string): Promise<ILanguage[]> {
        const dirPath = `${projectName}/${componentName}`;
        const projectExists = await fs.pathExists(`${Repo.path}/${dirPath}`);
        if (!projectExists) throw `Project "${dirPath}" does not exist.`;
        const dir = await fs.readdir(`${Repo.path}/${dirPath}`);
        const languages: ILanguage[] = [];
        for (const language of dir) {
            const match = language.match(/translation-(.{1,})\.json$/);
            if (match && typeof match[0] === 'string' && typeof match[1] === 'string') {
                languages.push({ name: match[1], file: match[0] });
            }
        }
        return languages;
    }
}
export const Translations = new TranslationsManager();

export interface IProject {
    name: string;
    components: IComponent[];
}

export interface IComponent {
    name: string;
    languages: ILanguage[];
}

export interface ILanguage {
    name: string;
    file: string;
}

export interface ITranslations {
    [key: string]: ITranslation;
}

export interface ITranslation {
    [key: string]: string;
}
