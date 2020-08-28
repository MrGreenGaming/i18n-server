import { IExtractedPots } from '../extraction/RepositoryStringExtractor';
import simpleGit, { SimpleGit, ResetMode, CleanOptions } from 'simple-git';
import fs, { outputFile } from 'fs-extra';
import logger from '../../shared/Logger';

class RepositoryClass implements RepositoryModel {
    public readonly path = `${process.cwd()}/files/i18nrepo`;
    private git: SimpleGit;
    private isInitiated = false;
    private isPushingComponents = false;
    private resetIntervalAmount = 5 * 60 * 1000;
    private remote = `https://${process.env.GH_USERNAME}:${process.env.GH_PERSONAL_ACCESS_TOKEN}@${process.env.REPO}`;
    constructor() {
        this.git = simpleGit();
        setInterval(this.reset.bind(this), this.resetIntervalAmount);
    }

    public async initiate(): Promise<void> {
        if (this.isInitiated) return;
        await fs.ensureDir(this.path);
        await this.git.cwd(this.path);
        await this.git.clone(this.remote, `${this.path}/.`);
        this.isInitiated = true;
    }
    public async reset(): Promise<void> {
        if (!this.isInitiated) await this.initiate();
        if (this.isPushingComponents) return;
        await this.git.reset(ResetMode.HARD);
        await this.git.clean(CleanOptions.RECURSIVE + CleanOptions.IGNORED_INCLUDED + CleanOptions.FORCE);
        await this.git.pull();
    }

    public async pushTranslationComponents(components: IExtractedPots[]): Promise<void> {
        if (!this.isInitiated) await this.initiate();
        let error;
        try {
            this.isPushingComponents = true;
            for (const component of components) {
                const path = `${this.path}/${component.project}/${component.component}/messages.pot`;
                await outputFile(path, component.content);
            }

            this.isPushingComponents = false;
        } catch (e) {
            error = e;
        } finally {
            this.isPushingComponents = false;
        }
        if (error) throw error;

        await this.push();
    }

    private async push(): Promise<void> {
        logger.info(`Pushing ${process.env.REPO} ...`);
        await this.git.addConfig('user.name', process.env.GH_USERNAME as string);
        await this.git.addConfig('user.password', process.env.GH_PERSONAL_ACCESS_TOKEN as string);
        await this.git.addConfig('user.email', process.env.GH_EMAIL as string);
        await this.git.add('*');
        await this.git.commit('Update base translation file(s) from extracted source strings');
        await this.git.push();
    }
}

const Repository = new RepositoryClass();
export { Repository };

export interface RepositoryModel {
    path: string;
    initiate(): Promise<void>;
    reset(): Promise<void>;
    pushTranslationComponents(components: IExtractedPots[]): Promise<void>;
}
