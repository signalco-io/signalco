import { vercelApp } from './vercelApp.js';

export function nextJsApp(prefix: string, name: string, rootDirectory?: string) {
    return vercelApp(prefix, name, {
        framework: 'nextjs',
        rootDirectory: rootDirectory,
    });
}