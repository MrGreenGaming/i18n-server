import { DownloadedExtractionRepositoryPath } from './ExtractionRepositoryDownloader';
import fs from 'fs-extra';
import xmlParser from 'xml2json';
import shell from 'shelljs';
import * as crypto from 'crypto';

export class RepositoryStringExtractor implements RepositoryStringExtractorModel {
    private repoPath?: DownloadedExtractionRepositoryPath;
    readonly keywords = [
        "--keyword='_'",
        "--keyword='_.register'",
        "--keyword='_.For'",
        "--keyword='_.many:1,2'",
        "--keyword='_.For.many:2,3'",
        "--keyword='_.context:1c,2'",
        "--keyword='_.For.context:2c,3'",
        "--keyword='_.contextMany:1c,2,3'",
        "--keyword='_.For.contextMany:2c,3,4'",
    ].join(' ');

    public async cleanup(): Promise<void> {
        if (this.repoPath && (await fs.pathExists(this.repoPath.absolute))) {
            await fs.remove(this.repoPath.absolute);
        }
    }

    public async extract(repoPath: DownloadedExtractionRepositoryPath): Promise<IExtractedPots[]> {
        if (!fs.existsSync(repoPath.absolute)) {
            throw 'repoPath invalid. Path does not exist';
        }
        await this.cleanup();
        this.repoPath = repoPath;
        const components = await this.getComponents(this.repoPath.absolute);
        const PotFiles = this.extractXgettext(components);
        return PotFiles;
    }

    private extractXgettext(components: IExtractedComponent[]): IExtractedPots[] {
        if (!this.repoPath) throw 'repoPath undefined';
        const repoPath = this.repoPath;
        const extracted: IExtractedPots[] = [];
        for (const component of components) {
            // Map array to xgettext file arg string
            const tmpFile = this.generateUniqueString();
            const filesList = component.scripts.map((v) => `.${v.split(repoPath.absolute)[1]}`).join(' ');

            const cmd = `echo ${filesList} | xargs xgettext --output='${repoPath.absolute}/${tmpFile}' --from-code=UTF-8 --add-comments='translators:' --directory='${this.repoPath.absolute}/' --omit-header ${this.keywords}`;
            shell.cd(repoPath.absolute);
            const componentPotString = shell.exec(cmd);

            if (componentPotString.code === 0 && fs.existsSync(`${repoPath.absolute}/${tmpFile}`)) {
                extracted.push({
                    component: component.component,
                    project: component.project,
                    content: fs.readFileSync(`${repoPath.absolute}/${tmpFile}`).toString(),
                });
            }
            // Remove extracted file if exist
            if (fs.existsSync(`${repoPath.absolute}/${tmpFile}`)) {
                fs.removeSync(`${repoPath.absolute}/${tmpFile}`);
            }
        }
        return extracted;
    }
    private async getComponents(basePath: string): Promise<IExtractedComponent[]> {
        let locations: IExtractedComponent[] = [];
        for (const entry of await fs.readdir(basePath)) {
            const entryPath = `${basePath}/${entry}`;
            if (entry === 'meta.xml') {
                try {
                    const extractedComponent = await this.readMeta(basePath);
                    if (extractedComponent) locations.push(extractedComponent);
                } catch (e) {
                    console.log(e.message, `${basePath}/${entry}`);
                }

                continue;
            } else if ((await fs.lstat(entryPath)).isDirectory()) {
                const entryLocations = await this.getComponents(entryPath);
                locations = locations.concat(entryLocations);
            }
        }
        return locations;
    }

    private async readMeta(basePath: string): Promise<IExtractedComponent | false> {
        const file = (await fs.readFile(`${basePath}/meta.xml`)).toString('utf8');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsed: any = xmlParser.toJson(file, { object: true });
        const project = parsed.meta?.info?.['i18n-project'];
        const component = parsed.meta?.info?.['i18n-component'];
        const metaScripts: { src: string }[] = parsed.meta?.script;
        if (project && component && metaScripts && metaScripts.length > 0) {
            const extracted: IExtractedComponent = {
                project,
                component,
                path: basePath,
                scripts: [],
            };
            metaScripts.forEach((v) => {
                const relativeScriptPath = v.src.replace(/\\/g, '/');
                if (fs.existsSync(`${basePath}/${relativeScriptPath}`))
                    extracted.scripts.push(`${basePath}/${relativeScriptPath}`);
            });
            return extracted;
        }
        return false;
    }
    private generateUniqueString(): string {
        return crypto.randomBytes(20).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
    }
}

export interface RepositoryStringExtractorModel {
    keywords: string;
    cleanup(): Promise<void>;
    extract(repoPath: DownloadedExtractionRepositoryPath): Promise<IExtractedPots[]>;
}

export interface IExtractedComponent {
    project: string;
    component: string;
    path: string;
    scripts: string[];
}

export interface IExtractedPots {
    component: string;
    project: string;
    content: string;
}
