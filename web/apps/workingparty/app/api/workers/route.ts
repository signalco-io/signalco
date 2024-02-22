import { workersCreate, workersGetAll } from '../../../src/lib/repository/workersRepository';

export async function GET() {
    return Response.json(await workersGetAll());
}

export async function POST(request: Request) {
    const json = await request.json();
    let marketplaceWorkerId: string | undefined = undefined;
    if (json && typeof json === 'object' && 'marketplaceWorkerId' in json && typeof json.marketplaceWorkerId === 'string') {
        marketplaceWorkerId = json.marketplaceWorkerId;
    }

    if (!marketplaceWorkerId)
        return Response.json({ error: 'Invalid request' }, { status: 400 });

    return Response.json({
        id: await workersCreate({ marketplaceWorkerId }),
    });
}
