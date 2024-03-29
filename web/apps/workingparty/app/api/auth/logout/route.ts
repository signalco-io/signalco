import { cookies } from 'next/headers';

export async function POST() {
    cookies().delete('wp_session');
    return Response.json(null);
}
