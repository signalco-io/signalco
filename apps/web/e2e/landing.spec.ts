import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function assertAccessibility(page: Page, url: string) {
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
test('channels should be accessible', ({ page }) => assertAccessibility(page, '/channels'));
test('design should be accessible', ({ page }) => assertAccessibility(page, '/design'));
// test('pricing should be accessible', ({ page }) => assertAccessibility(page, '/pricing'));
test('station should be accessible', ({ page }) => assertAccessibility(page, '/station'));

test('privacy policy should be accessible', ({ page }) => assertAccessibility(page, '/legal/privacy-policy'));
test('TOS should be accessible', ({ page }) => assertAccessibility(page, '/legal/terms-of-service'));
test('acceptable use policy should be accessible', ({ page }) => assertAccessibility(page, '/legal/acceptable-use-policy'));
test('SLA should be accessible', ({ page }) => assertAccessibility(page, '/legal/sla'));
