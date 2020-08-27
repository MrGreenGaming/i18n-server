import { ExtractionRepositoryModel } from './ExtractionRepository';
import unzipper from 'unzipper';
import { IncomingMessage } from 'http';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs-extra';
import * as crypto from 'crypto';

export class ExtractionRepositoryDownloader implements ExtractionRepositoryDownloaderModel {
    public readonly repo: ExtractionRepositoryModel;
    public path?: DownloadedExtractionRepositoryPath;
    public readonly identifier: string;
    private tempPath = `${process.cwd()}/files/extraction`;

    constructor(repo: ExtractionRepositoryModel) {
        this.identifier = this.generateUniqueString();
        this.repo = repo;
    }

    public async download(): Promise<DownloadedExtractionRepositoryPath> {
        await fs.ensureDir(this.tempPath);
        const repoDownload: AxiosResponse<IncomingMessage> = await axios({
            method: 'get',
            responseType: 'stream',
            url: `https://github.com/${this.repo.owner}/${this.repo.name}/zipball/${this.repo.branch}`,
            headers: { Authorization: `token ${process.env.GH_PERSONAL_ACCESS_TOKEN}` },
        });

        const folderName = repoDownload.headers['content-disposition']
            ? (repoDownload.headers['content-disposition'] as string).split('filename=')[1].split('.zip')[0]
            : undefined;
        if (!folderName) throw `Could not get file name from header`;
        await this.unzip(repoDownload.data, `${this.tempPath}/${this.identifier}`);

        this.path = {
            relative: `./extraction/${this.identifier}`,
            absolute: `${this.tempPath}/${this.identifier}`,
        };
        return Promise.resolve(this.path);
    }

    async remove(): Promise<void> {
        if (this.path && (await fs.pathExists(this.path.absolute))) {
            console.log('removing');
            await fs.remove(this.path.absolute);
        }
    }

    private unzip(data: IncomingMessage, path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            data.pipe(
                unzipper
                    .Extract({ path: path })
                    .on('close', () => {
                        resolve();
                    })
                    .on('error', (e) => {
                        reject(e);
                    }),
            );
            data.on('error', (err) => {
                reject(err);
            });
        });
    }

    private generateUniqueString(): string {
        return crypto.randomBytes(20).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    }
}

export interface ExtractionRepositoryDownloaderModel {
    repo: ExtractionRepositoryModel;
    path?: DownloadedExtractionRepositoryPath;
    identifier: string;
    download(): Promise<DownloadedExtractionRepositoryPath>;
    remove(): Promise<void>;
}

export interface DownloadedExtractionRepositoryPath {
    relative: string;
    absolute: string;
}
