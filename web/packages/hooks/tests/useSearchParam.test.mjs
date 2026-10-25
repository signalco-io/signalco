import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { test } from 'node:test';
import { createContext, SourceTextModule, SyntheticModule } from 'node:vm';

const source = stripTypeScriptTypes(await readFile(new URL('../src/useSearchParam.ts', import.meta.url), 'utf8'));

// Run the actual hook with isolated React/Next bindings, without a browser or dependencies.
async function createSetter({ search = '', hash = '', browser = true } = {}) {
    const replacements = [];
    const location = { hash };
    const context = createContext({
        URLSearchParams,
        console: { debug() {} },
        ...(browser ? { window: { location } } : {}),
    });
    const bindings = {
        react: { useCallback: (callback) => callback },
        'next/navigation': {
            usePathname: () => '/channels',
            useRouter: () => ({ replace: (url) => replacements.push(url) }),
            useSearchParams: () => new URLSearchParams(search),
        },
        // Node's type stripping preserves this import; the TypeScript build erases it.
        '@signalco/js': { StringOrUndefined: undefined },
    };
    const hook = new SourceTextModule(source, { context });
    await hook.link((specifier) => {
        const exports = bindings[specifier];
        assert.ok(exports, `Unexpected import: ${specifier}`);
        return new SyntheticModule(Object.keys(exports), function () {
            for (const [name, value] of Object.entries(exports)) this.setExport(name, value);
        }, { context });
    });
    await hook.evaluate();

    return {
        set: hook.namespace.useSetSearchParam('filter'),
        replacements,
        location,
    };
}

for (const scenario of [
    {
        name: 'adding a query parameter preserves the hash',
        search: '', value: 'new', hash: '#details',
        expected: '/channels?filter=new#details',
    },
    {
        name: 'updating a query parameter preserves other parameters and the hash',
        search: 'filter=old&sort=name', value: 'new', hash: '#details',
        expected: '/channels?filter=new&sort=name#details',
    },
    {
        name: 'removing a query parameter preserves other parameters and the hash',
        search: 'filter=old&sort=name', value: undefined, hash: '#details',
        expected: '/channels?sort=name#details',
    },
    {
        name: 'removing the last query parameter preserves the hash without a question mark',
        search: 'filter=old', value: undefined, hash: '#details',
        expected: '/channels#details',
    },
    {
        name: 'an empty value still removes the parameter and preserves the hash',
        search: 'filter=old', value: '', hash: '#details',
        expected: '/channels#details',
    },
    {
        name: 'encoded query values and repeated parameters keep their existing semantics',
        search: 'filter=old&tag=c%2B%2B&tag=two+words', value: 'new value', hash: '#details',
        expected: '/channels?filter=new+value&tag=c%2B%2B&tag=two+words#details',
    },
    {
        name: 'encoded and query-like characters in a hash are preserved verbatim',
        search: '', value: 'new', hash: '#section%20two?tab=api&mode=raw#nested',
        expected: '/channels?filter=new#section%20two?tab=api&mode=raw#nested',
    },
    {
        name: 'a URL without a hash gets no extra fragment marker',
        search: '', value: 'new', hash: '',
        expected: '/channels?filter=new',
    },
    {
        name: 'removing the last parameter without a hash leaves only the pathname',
        search: 'filter=old', value: undefined, hash: '',
        expected: '/channels',
    },
]) {
    test(scenario.name, async () => {
        const { set, replacements } = await createSetter(scenario);
        set(scenario.value);
        assert.deepEqual(replacements, [scenario.expected]);
    });
}

test('the setter reads the latest hash when invoked after render', async () => {
    const { set, replacements, location } = await createSetter({ hash: '#initial' });
    location.hash = '#changed%20section';
    set('new');
    assert.deepEqual(replacements, ['/channels?filter=new#changed%20section']);
});

test('setting an unchanged value does not navigate', async () => {
    const { set, replacements } = await createSetter({ search: 'filter=same', hash: '#details' });
    set('same');
    assert.deepEqual(replacements, []);
});

test('removing an absent parameter does not navigate', async () => {
    const { set, replacements } = await createSetter({ search: 'sort=name', hash: '#details' });
    set(undefined);
    assert.deepEqual(replacements, []);
});

test('creating and invoking the setter without window is safe', async () => {
    const { set, replacements } = await createSetter({ browser: false });
    set('new');
    assert.deepEqual(replacements, ['/channels?filter=new']);
});
