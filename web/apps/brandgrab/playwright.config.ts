import path from 'path'
import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = process.env.PORT || 4001
const baseURL = `http://127.0.0.1:${PORT}`

const config: PlaywrightTestConfig = {
    retries: 2,
    timeout: 30 * 1000,
    testDir: path.join(dirname(fileURLToPath(import.meta.url)), 'e2e'),
    outputDir: 'test-results/',
    webServer: {
        command: 'pnpm start',
        url: baseURL,
        timeout: 120 * 1000
    },
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 },
        baseURL,
        trace: 'retry-with-trace',
        video: 'off'
    },
    projects: [
        {
            name: 'Desktop Edge',
            use: {
                ...devices['Desktop Edge'],
            },
        },
        {
            name: 'Mobile Chrome',
            use: {
                ...devices['Pixel 5'],
            },
        }
    ],
};
export default config;
