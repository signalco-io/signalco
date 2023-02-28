import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function assertAccessibility(page: Page, url: string) {
    await page.goto(url);
    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag21aaa'])
        .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
}

test('should contain header', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Automate your life')
});

test('should be accessible', ({ page }) => assertAccessibility(page, '/'));
// test('pricing should be accessible', ({ page }) => assertAccessibility(page, '/pricing'));
