import { test } from '@playwright/test'
import { assertAccessibility } from './landing.spec';

test('channels should be accessible', ({ page }) => assertAccessibility(page, '/design'));
