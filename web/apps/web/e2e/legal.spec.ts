import { test } from '@playwright/test'
import { assertAccessibility } from './landing.spec';

test('privacy policy should be accessible', ({ page }) => assertAccessibility(page, '/legal/privacy-policy'));
test('TOS should be accessible', ({ page }) => assertAccessibility(page, '/legal/terms-of-service'));
test('acceptable use policy should be accessible', ({ page }) => assertAccessibility(page, '/legal/acceptable-use-policy'));
test('SLA should be accessible', ({ page }) => assertAccessibility(page, '/legal/sla'));
