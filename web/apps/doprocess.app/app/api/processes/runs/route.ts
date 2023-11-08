import { getAllProcessesRuns } from '../../../../src/lib/repo/processesRepository';
import { ensureUserId } from '../../../../src/lib/auth/apiAuth';

export async function GET() {
    const { userId } = ensureUserId();
    return Response.json(await getAllProcessesRuns(userId));
}
