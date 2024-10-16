import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST() {
    cookies().delete('wp_session');
    return Response.json(null);
}
