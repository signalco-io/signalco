import { accountUsage } from '../../../../../src/lib/repository/accountsRepository';
import { withAuth } from '../../../../../src/lib/auth/withAuth';

export const dynamic = 'force-dynamic';

export type AccountUsageDto = {
    messages: {
        unlimited: boolean
        total: number,
        used: number,
    },
    workers: {
        unlimited: boolean
        total: number,
        used: number,
    },
    period: {
        start: string | null,
        end: string | null,
    },
};

export async function GET(_request: Request, { params }: { params: { accountId: string } }) {
    const { accountId } = params;
    if (!accountId)
        return new Response(null, { status: 400 });

    return await withAuth(async ({ accountId: authAccountId }) => {
        if (authAccountId !== accountId)
            return new Response(null, { status: 404 });

        const usage = await accountUsage(accountId);

        return Response.json({
            messages: usage.messages,
            workers: usage.workers,
            period: {
                start: usage.period?.start.toISOString() ?? null,
                end: usage.period?.end.toISOString() ?? null,
            }
        });
    });
}