import { RepositoryStringExtractorModel, RepositoryStringExtractor } from './RepositoryStringExtractor';
import { ExtractionRepositoryDownloaderModel, ExtractionRepositoryDownloader } from './ExtractionRepositoryDownloader';

export class ExtractionRepository implements ExtractionRepositoryModel {
    public readonly owner: string;
    public readonly name: string;
    public readonly branch: string;
    public readonly zipURL: string;
    public readonly tarURL: string;
    public readonly downloader: ExtractionRepositoryDownloaderModel;
    public readonly extractor: RepositoryStringExtractorModel;
    constructor(owner: string, name: string, branch: string) {
        this.owner = owner;
        this.name = name;
        this.branch = branch;
        this.zipURL = `https://github.com/${owner}/${name}/zipball/${branch}`;
        this.tarURL = `https://github.com/${owner}/${name}/tarball/${branch}`;
        this.downloader = new ExtractionRepositoryDownloader(this);
        this.extractor = new RepositoryStringExtractor();
    }
}

export interface ExtractionRepositoryModel {
    readonly owner: string;
    readonly name: string;
    readonly branch: string;
    readonly zipURL: string;
    readonly tarURL: string;
    readonly downloader: ExtractionRepositoryDownloaderModel;
    readonly extractor: RepositoryStringExtractorModel;
}
