import { vercelApp } from './vercelApp';

export function nextJsApp(prefix: string, name: string) {
    vercelApp(prefix, name, {
        framework: 'nextjs',
    });
}