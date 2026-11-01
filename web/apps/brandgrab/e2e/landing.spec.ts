import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAEUlEQVQYlWMQMgkjiBhGFQEAu5c6ge7OloIAAAAASUVORK5CYII=';

async function mockLookup(page: Page, { artwork = true, previewError = false } = {}) {
    await page.route('**/api/quick?*', (route) => route.fulfill({ json: {
        domain: new URL(route.request().url()).searchParams.get('domain'),
        title: 'Example branding', description: 'A website description',
        html: '<html lang="en"><head><title>Example branding</title><meta name="description" content="A website description"><meta name="viewport" content="width=device-width"></head><body><h1>Example</h1></body></html>',
        favicon: { url: '/icon.png', base64: artwork ? image : '' }, icons: {},
        og: { title: 'Open Graph title', description: 'Social preview', image: '/og.png', imageBase64: artwork ? image : '', url: '' },
    } }));
    await page.route('**/api/screenshot?*', (route) => previewError
        ? route.fulfill({ status: 504, contentType: 'text/html', body: '<h1>Gateway timeout</h1>' })
        : route.fulfill({ json: { data: image, width: 1, height: 1, inspection: { styles: [{ tag: 'p', text: 'Example text', color: 'rgb(18, 52, 86)', background: 'rgb(255, 255, 255)', family: 'Arial, sans-serif', size: '16px', weight: '400', lineHeight: '24px', spacing: 'normal', count: 1 }], checks: [], headings: [], language: 'en', sampled: 1, total: 1 } } }));
}

async function assertAccessibility(page: Page) {
    const scan = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag21aaa']).analyze();
    expect(scan.violations).toEqual([]);
}

for (const colorScheme of ['light', 'dark'] as const) {
    test(`landing is accessible in system ${colorScheme} mode`, async ({ page }) => {
        await page.emulateMedia({ colorScheme });
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Discover website branding' })).toBeVisible();
        await expect(page.locator('body')).toHaveCSS('background-color', colorScheme === 'dark' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
        await assertAccessibility(page);
    });
}

test('updates with system appearance changes without reloading or losing input', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Domain', exact: true }).fill('example.com');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(page.getByRole('textbox', { name: 'Domain', exact: true })).toHaveValue('example.com');
    await page.emulateMedia({ colorScheme: 'light' });
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('grabs a full URL, renders results and fits the viewport', async ({ page }) => {
    await mockLookup(page);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Domain', exact: true }).fill(' https://example.com/brand?a=1&b=2 ');
    await page.getByRole('button', { name: 'Grab' }).click();
    await expect(page.getByRole('heading', { name: 'Example branding', exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Desktop page preview', exact: true })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Desktop page preview', exact: true })).toHaveJSProperty('naturalWidth', 12);
    await page.getByRole('tab', { name: 'Branding', exact: true }).click();
    await expect(page.getByText('#123456').first()).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Domain', exact: true })).toHaveValue('https://example.com/brand?a=1&b=2');
    await page.getByRole('tab', { name: 'Social previews' }).click();
    await expect(page.getByRole('link', { name: 'Open Graph title', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    await assertAccessibility(page);
});

test('shows a preview failure and preserves metadata when optional artwork is absent', async ({ page }) => {
    await mockLookup(page, { artwork: false, previewError: true });
    await page.goto('/?domain=example.com');
    await expect(page.getByRole('heading', { name: 'Example branding', exact: true })).toBeVisible();
    await expect(page.getByText('Could not load this website. Please try again.').first()).toBeVisible();
    await expect(page.getByRole('img', { name: 'Loading preview' })).toHaveCount(0);
    await expect(page.getByRole('img', { name: 'Website icon' })).toHaveCount(0);
});

test('shows lookup failures and supports correcting the address', async ({ page }) => {
    await page.route('**/api/quick?*', (route) => route.fulfill({ status: 502, json: { error: 'Could not load this website.' } }));
    await page.goto('/?domain=unavailable.example.com');
    await expect(page.getByText('Could not load this website.', { exact: true }).first()).toBeVisible();
    await mockLookup(page);
    await page.getByRole('textbox', { name: 'Domain', exact: true }).fill('example.com');
    await page.getByRole('button', { name: 'Grab' }).click();
    await expect(page.getByRole('heading', { name: 'Example branding', exact: true })).toBeVisible();
});

test('can retry the same website after a failure', async ({ page }) => {
    await page.route('**/api/quick?*', (route) => route.fulfill({ status: 502, json: { error: 'Please retry.' } }));
    await page.goto('/?domain=https%3A%2F%2Fexample.com%2F');
    await expect(page.getByRole('alert').filter({ hasText: 'Please retry.' })).toBeVisible();
    await mockLookup(page);
    await page.getByRole('button', { name: 'Grab' }).click();
    await expect(page.getByRole('heading', { name: 'Example branding', exact: true })).toBeVisible();
});

test('rejects invalid input and allows clearing a lookup', async ({ page }) => {
    await mockLookup(page);
    await page.goto('/?domain=example.com');
    const input = page.getByRole('textbox', { name: 'Domain', exact: true });
    await input.fill('file://example.com');
    await page.getByRole('button', { name: 'Grab' }).click();
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Enter a public website domain or an HTTP(S) URL.')).toBeVisible();
    await input.fill('');
    await input.press('Enter');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Example branding', exact: true })).toHaveCount(0);
});

test('footer links and old legal URLs reach the published legal pages', async ({ page, request }) => {
    await page.goto('/');
    for (const [name, path] of [['Privacy Policy', 'privacy-policy'], ['Terms of Service', 'terms-of-service'],
        ['Cookie Policy', 'cookie-policy'], ['Acceptable Use Policy', 'acceptable-use-policy'], ['SLA', 'sla']]) {
        await expect(page.getByRole('link', { name, exact: true })).toHaveAttribute('href', `https://www.signalco.io/legal/${path}`);
        const response = await request.get(`/legal/${path}`, { maxRedirects: 0 });
        expect(response.status()).toBe(308);
        expect(response.headers().location).toBe(`https://www.signalco.io/legal/${path}`);
    }
});


test('device results appear independently and tab keyboard navigation works', async ({ page }) => {
    await mockLookup(page);
    let release;
    const held = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/api/screenshot?*', async route => {
        const device = new URL(route.request().url()).searchParams.get('device');
        if (device === 'desktop') await held;
        await route.fulfill({ json: { data: image, width: 12, height: 8 } });
    });
    await page.goto('/?domain=example.com');
    await expect(page.getByRole('img', { name: 'Mobile page preview' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Desktop page preview' })).toHaveCount(0);
    release!();
    await expect(page.getByRole('img', { name: 'Desktop page preview' })).toBeVisible();
    await page.getByRole('tab', { name: 'Page previews' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Branding', exact: true })).toBeFocused();
    await expect(page.getByRole('tab', { name: 'Branding', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('SEO, accessibility and nested sitemap exploration work on the client', async ({ page }) => {
    await mockLookup(page);
    await page.route('**/api/document?*', route => {
        const url = new URL(route.request().url()).searchParams.get('url')!;
        const text = url.endsWith('robots.txt') ? 'User-agent: *\nSitemap: https://example.com/sitemap.xml' : url.endsWith('sitemap.xml') ? '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://example.com/pages.xml</loc></sitemap></sitemapindex>' : '<urlset><url><loc>https://example.com/about</loc><lastmod>2026-11-01</lastmod></url><url><loc>javascript:alert(1)</loc></url></urlset>';
        return route.fulfill({ json: { url, text } });
    });
    await page.goto('/?domain=example.com');
    await page.getByRole('tab', { name: 'SEO', exact: true }).click();
    await expect(page.getByText('1 H1 headings')).toBeVisible();
    await assertAccessibility(page);
    await page.getByRole('tab', { name: 'Accessibility', exact: true }).click();
    await expect(page.getByRole('tabpanel', { name: 'Accessibility' }).getByText('Document language', { exact: true })).toBeVisible();
    await assertAccessibility(page);
    await page.getByRole('tab', { name: 'Sitemap', exact: true }).click();
    await page.getByRole('button', { name: 'Explore', exact: true }).click();
    await page.getByRole('button', { name: 'https://example.com/pages.xml', exact: true }).click();
    await expect(page.getByRole('link', { name: 'https://example.com/about', exact: true })).toBeVisible();
    await expect(page.getByText('1 URLs found')).toBeVisible();
    await page.getByRole('searchbox', { name: 'Filter URLs' }).fill('missing');
    await expect(page.getByRole('link', { name: 'https://example.com/about', exact: true })).toHaveCount(0);
    await assertAccessibility(page);
});
