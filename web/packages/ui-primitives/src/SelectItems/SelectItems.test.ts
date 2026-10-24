import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SelectItems } from './SelectItems';

const items = [
    { value: '1', label: 'First option' },
    { value: '2', label: 'Default option' },
];

describe('SelectItems initial rendering', () => {
    it('renders the default item before client effects run', () => {
        const html = renderToStaticMarkup(createElement(SelectItems, { defaultValue: '2', items }));

        expect(html).toContain('Default option');
        expect(html).not.toContain('First option');
    });

    it('prefers the controlled value over the default', () => {
        const html = renderToStaticMarkup(createElement(SelectItems, { value: '1', defaultValue: '2', items }));

        expect(html).toContain('First option');
        expect(html).not.toContain('Default option');
    });

    it('preserves the selected item icon and custom content', () => {
        const html = renderToStaticMarkup(createElement(SelectItems, {
            defaultValue: '2',
            items: [{ value: '2', label: 'Default option', icon: createElement('svg', { 'aria-label': 'Selected icon' }), content: 'Custom content' }],
        }));

        expect(html).toContain('Selected icon');
        expect(html).toContain('Custom content');
        expect(html).not.toContain('Default option');
    });

    it('falls back to the item value when no label is provided', () => {
        const html = renderToStaticMarkup(createElement(SelectItems, { defaultValue: 'fallback', items: [{ value: 'fallback' }] }));

        expect(html).toContain('fallback');
    });

    it.each([undefined, ''])('shows the placeholder for an empty controlled value: %s', (value) => {
        const html = renderToStaticMarkup(createElement(SelectItems, { value, placeholder: 'Choose an option', items }));

        expect(html).toContain('Choose an option');
        expect(html).not.toContain('Default option');
    });

    it('does not use the default when the controlled value is empty', () => {
        const html = renderToStaticMarkup(createElement(SelectItems, { value: '', defaultValue: '2', placeholder: 'Choose an option', items }));

        expect(html).toContain('Choose an option');
        expect(html).not.toContain('Default option');
    });
});
