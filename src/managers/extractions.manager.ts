// Currently only supports MTA:SA Lua extractions

import BaseManager from './base';
import extractionsConfig from '../extractionsConfig.json';
import { ExtractionRepositoryModel, ExtractionRepository } from '../lib/extraction/ExtractionRepository';
import { Repository } from '../lib/repository/Repository';
import logger from '../shared/Logger';

class ExtractionsManager extends BaseManager {
    private i18nRepo = Repository;
    private extractionRepos: ExtractionRepositoryModel[] = [];
    public async init() {
        // Create extractionRepos from file extractionsConfig.json
        for (const repo of extractionsConfig) {
            const extractionRepo = new ExtractionRepository(repo.repoOwner, repo.repoName, repo.branch);
            this.extractionRepos.push(extractionRepo);
        }
        await Repository.initiate();
    }

    public async extractAndPush(repo: ExtractionRepository): Promise<void> {
        let err: Error | undefined;
        try {
            const path = await repo.downloader.download();
            const extracts = await repo.extractor.extract(path);
            await this.i18nRepo.pushTranslationComponents(extracts);
        } catch (e) {
            err = e;
        } finally {
            repo.downloader.remove();
            if (err) throw err;
        }
    }

    public getExtractionRepository(owner: string, name: string): ExtractionRepository {
        const repo = this.extractionRepos.find((v) => v.name === name && v.owner === owner);
        if (!repo) throw Error(`Could not find extraction repository by owner: ${owner}, name: '${name}'`);
        return repo;
    }

    public async extractFromPayload(payload: GithubWebhookPushPayload): Promise<void> {
        const repo = this.getExtractionRepository(payload.repository.owner.name, payload.repository.name);
        logger.log(`Extracting for ${repo.owner}/${repo.name}#${repo.branch}`, {});
        await this.extractAndPush(repo);
    }
}
export const Extraction = new ExtractionsManager();

export interface GithubWebhookPushPayload {
    ref: string;
    before: string;
    after: string;
    created: string;
    forced: boolean;
    deleted: boolean;
    base_ref: string | null;
    compare: string;
    commits: string[];
    head_commit: string | null;
    repository: GithubWebhookPushPayload_Repository;
    pusher: GithubWebhookPushPayload_Pusher;
    sender: GithubWebhookPushPayload_Sender;
}

interface GithubWebhookPushPayload_Repository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: GithubWebhookPushPayload_Repository_Owner;
    html_url: string;
    description: string | null;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: number;
    updated_at: Date;
    pushed_at: number;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage: string | null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license: string | null;
    forks: number;
    open_issues: number;
    watchers: number;
    stargazers: number;
    default_branch: string;
    master_branch: string;
}

interface GithubWebhookPushPayload_Sender {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
interface GithubWebhookPushPayload_Pusher {
    name: string;
    email: string;
}
interface GithubWebhookPushPayload_Repository_Owner {
    name: string;
    email: string;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
}
