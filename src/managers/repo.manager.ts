import BaseManager from './base';
import * as fs from 'fs-extra';
import simpleGit, { SimpleGit, ResetMode, CleanOptions } from 'simple-git';
import logger from '../shared/Logger';

class RepoManager extends BaseManager {
    readonly path = `${process.cwd()}/repo/`;
    readonly repo = process.env.REPO as string;
    readonly pathCreated = fs.ensureDirSync(this.path);
    private git: SimpleGit = simpleGit({ baseDir: this.path });
    private updateFrequency = 10 * 60 * 1000;
    private readonly updateInterval = setInterval(this.update.bind(this), this.updateFrequency);

    public async init(): Promise<void> {
        if (!fs.existsSync(`${this.path}/.git`)) {
            await this.git.clone(this.repo, '.');
        }
        await this.update();
    }

    private async update(): Promise<void> {
        try {
            await this.git.remote(['update']);
            const status = await this.git.status();
            if (status.behind === 0) return;

            await this.git.reset(ResetMode.HARD);
            await this.git.clean(CleanOptions.RECURSIVE + CleanOptions.IGNORED_INCLUDED + CleanOptions.FORCE);
            await this.git.pull();
            const log = await this.git.log();
            console.log(log.latest);
            logger.info('Updated repository');
        } catch (e) {
            logger.error(e);
            return;
        }
    }
}
export const Repo = new RepoManager();
