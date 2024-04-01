import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST() {
    cookies().delete('wp_session');
    return Response.json(null);
}
