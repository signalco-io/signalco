import { expect } from '@playwright/test'
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function assertAccessibility(page: Page, url: string) {
    await page.goto(url);
    await page.waitForTimeout(1000);
    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag21aaa'])
        .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
}

// test('should be accessible', ({ page }) => assertAccessibility(page, '/'));
