import BaseManager from './base';
import * as fs from 'fs-extra';
import jsonfile from 'jsonfile';
import logger from '../shared/Logger';
import nodeCache from 'node-cache';
import { Repository } from '../lib/repository/Repository';
import { PoParser, TrimmedGetTextTranslations } from '../lib/parser/PoParser';
import path from 'path';

class TranslationsManager extends BaseManager {
    private jsonPath = `${process.cwd()}/files/translations`;
    private parser = new PoParser();
    private repoPath: string;
    private projects: IProject[] = [];
    private refreshIntervalAmount = 5 * 60 * 1000;
    private translationCache = new nodeCache({
        stdTTL: this.refreshIntervalAmount / 1000,
        deleteOnExpire: true,
        checkperiod: 60,
    });

    constructor() {
        super();
        this.repoPath = Repository.path;
        setInterval(this.refresh.bind(this), this.refreshIntervalAmount);
    }

    public async init(): Promise<void> {
        await fs.ensureDir(this.jsonPath);
        await Repository.initiate();
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
                    `${this.jsonPath}/${projectName}/${componentName}/${langfile.file}`,
                );
                translations[langfile.name] = json;
            } catch (e) {
                logger.error(e);
            }
        }
        this.translationCache.set(`${projectName}-${componentName}`, translations);
        return translations;
    }

    public async getComponentTranslationsLanguage(projectName: string, componentName: string, language: string) {
        language = language.toLocaleLowerCase();
        // Check if language is present
        const languageFiles = this.getComponentLanguages(projectName, componentName);
        let langFile;
        for (const lang of languageFiles) {
            if (lang.name === language) {
                langFile = lang;
                break;
            }
        }
        if (!langFile) throw new Error(`Language ${language} does not exist in ${projectName}/${componentName}`);

        // Check cache
        if (this.translationCache.has(`${projectName}-${componentName}-${language}`)) {
            return this.translationCache.get(`${projectName}-${componentName}-${language}`) as ITranslation;
        }

        let translation: ITranslation = {};
        try {
            const json: ITranslation = await jsonfile.readFile(
                `${this.jsonPath}/${projectName}/${componentName}/${langFile.file}`,
            );
            translation = json;
        } catch (e) {
            logger.error(e);
            throw e;
        }
        // Set cache
        this.translationCache.set(`${projectName}-${componentName}-${language}`, translation);
        return translation;
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
        await this.parseRepository();
        this.projects = await this.cacheAllProjects();
    }

    private async parseRepository() {
        await fs.emptyDir(this.jsonPath);
        await this.saveFetchedPoFiles(await this.fetchPoFiles());
    }
    private async saveFetchedPoFiles(files: IFetchedPoFile[]) {
        for (const file of files) {
            let parsed: TrimmedGetTextTranslations;
            try {
                parsed = this.parser.parse(file.path);
                const parsedJSON = JSON.stringify(parsed);
                const parsedPath = `${this.jsonPath}/${file.project}/${file.component}/${file.language}.json`;
                await fs.outputFile(parsedPath, parsedJSON);
            } catch (e) {
                logger.error(e);
            }
        }
    }

    private async fetchPoFiles(): Promise<IFetchedPoFile[]> {
        const fetchedPoFiles: IFetchedPoFile[] = [];
        for (const project of await fs.readdir(this.repoPath)) {
            if (project !== '.git' && (await fs.stat(`${this.repoPath}/${project}`)).isDirectory()) {
                for (const component of await fs.readdir(`${this.repoPath}/${project}`)) {
                    if (
                        component !== '.git' &&
                        (await fs.stat(`${this.repoPath}/${project}/${component}`)).isDirectory()
                    ) {
                        for (const file of await fs.readdir(`${this.repoPath}/${project}/${component}`)) {
                            const ext = path.extname(`${this.repoPath}/${project}/${component}/${file}`);
                            if (ext === '.po') {
                                const filePath = `${this.repoPath}/${project}/${component}/${file}`;
                                const language = file.substring(0, file.length - 3);
                                fetchedPoFiles.push({
                                    path: filePath,
                                    component,
                                    project,
                                    language,
                                });
                            }
                        }
                    }
                }
            }
        }
        return fetchedPoFiles;
    }

    private async cacheAllProjects(): Promise<IProject[]> {
        const dir = await fs.readdir(this.jsonPath);
        const projects: IProject[] = [];
        for (const file of dir) {
            const stat = await fs.stat(`${this.jsonPath}/${file}`);
            if (stat.isDirectory() && file !== '.git') {
                const components = await this.cacheAllProjectComponents(file);
                projects.push({ name: file, components });
            }
        }
        return projects;
    }

    private async cacheAllProjectComponents(projectName: string): Promise<IComponent[]> {
        const projectExists = await fs.pathExists(`${this.jsonPath}/${projectName}`);
        if (!projectExists) throw `Project "${projectName}" does not exist.`;
        const dir = await fs.readdir(`${this.jsonPath}/${projectName}`);
        const components: IComponent[] = [];
        for (const file of dir) {
            const stat = await fs.stat(`${this.jsonPath}/${projectName}/${file}`);
            if (stat.isDirectory()) {
                const languages = await this.cacheAllComponentLanguages(projectName, file);
                components.push({ name: file, languages });
            }
        }
        return components;
    }

    private async cacheAllComponentLanguages(projectName: string, componentName: string): Promise<ILanguage[]> {
        const dirPath = `${projectName}/${componentName}`;
        const projectExists = await fs.pathExists(`${this.jsonPath}/${dirPath}`);
        if (!projectExists) throw `Project "${dirPath}" does not exist.`;
        const dir = await fs.readdir(`${this.jsonPath}/${dirPath}`);
        const languages: ILanguage[] = [];
        for (const language of dir) {
            const match = language.match(/(.{1,})\.json$/);
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
    [language: string]: ITranslation;
}

export interface ITranslation {
    [context: string]: { [id: string]: string[] };
}

interface IFetchedPoFile {
    language: string;
    path: string;
    component: string;
    project: string;
}
