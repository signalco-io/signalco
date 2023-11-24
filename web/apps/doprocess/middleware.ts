import { authMiddleware } from '@clerk/nextjs';

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
    publicRoutes: [
        '/',
        '/runs(.*)',
        '/processes(.*)',
        '/documents(.*)',
        '/api/documents(.*)',
        '/api/runs(.*)',
        '/api/processes(.*)',
    ],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
};
