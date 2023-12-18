import { vercelApp } from './vercelApp.js';

export function nextJsApp(prefix: string, name: string) {
    vercelApp(prefix, name, {
        framework: 'nextjs',
    });
}