import { test, expect } from '@playwright/test'
import { assertAccessibility } from './shared';

test('should contain header', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('');
});

test('should be accessible', ({ page }) => assertAccessibility(page, '/'));
// test('pricing should be accessible', ({ page }) => assertAccessibility(page, '/pricing'));
