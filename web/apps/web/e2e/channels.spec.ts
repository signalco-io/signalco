import { test } from '@playwright/test'
import { assertAccessibility } from './shared';

test('channels should be accessible', ({ page }) => assertAccessibility(page, '/channels'));
