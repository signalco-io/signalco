import { Octokit } from 'octokit';
import Roadmap from './roadmap';

export type RoadmapItemStatus = 'triage' | 'planned' | 'inQueue' | 'inProgress' | 'completed';

export type RoadmapItem = {
    title: string;
    status: RoadmapItemStatus;
    scope: string;
    votes?: number | undefined;
    href?: string | undefined;
}

async function getRoadmapItemsAsync() {
    const octokit = new Octokit({ auth: process.env.GITHUB_PAT_TOKEN });

    const iterator = octokit.paginate.iterator(octokit.rest.issues.listForRepo, {
        owner: 'signalco-io',
        repo: 'signalco',
        per_page: 100,
        state: 'all',
        sort: 'updated'
    });

    const items: RoadmapItem[] = [];
    for await (const { data: issues } of iterator) {
        if (Array.isArray(issues) === false) {
            return { error: 'Unexpected response from GitHub API' };
        }

        // Top 200 issues
        if (issues.length >= 200) {
            break;
        }

        for (const issue of issues) {
            const labelNames = issue.labels.map(l => typeof l === 'string' ? l : l.name);

            // Ignore issues that are not features or enhancements
            if (!labelNames.includes('feature') &&
                !labelNames.includes('enhancement')) {
                continue;
            }

            const title = issue.title;
            const scope = labelNames.find(label => label?.startsWith('area:'))?.replace('area:', '');
            const isApproved = !labelNames.includes('needs-triage');
            const inQueue = !!issue.milestone;
            const inProgress = !!issue.assignee;
            const isComplete = issue.state === 'closed';
            const votes = issue.reactions?.['+1'] ?? 0;
            let status: RoadmapItemStatus = 'triage';
            if (isApproved) {
                status = 'planned';
            }
            if (inQueue) {
                status = 'inQueue';
            }
            if (inProgress) {
                status = 'inProgress';
            }
            if (isComplete) {
                status = 'completed';
            }

            if (title && scope) {
                items.push({
                    title,
                    scope,
                    status,
                    votes,
                    href: issue.html_url
                });
            }
        }
    }
    return {items};
}

export default async function RoadmapPage() {
    const {items, error} = await getRoadmapItemsAsync();

    return (
        <Roadmap items={items} error={error} />
    );
}
