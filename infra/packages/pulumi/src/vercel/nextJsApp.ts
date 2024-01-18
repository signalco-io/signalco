import { vercelApp } from './vercelApp.js';

export function nextJsApp(prefix: string, name: string, noGit: boolean = false) {
    return vercelApp(prefix, name, {
        framework: 'nextjs',
    }, noGit);
}