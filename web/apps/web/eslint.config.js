import shared from '@signalco/eslint-config-signalco';
export default [
    ...shared,
    {
        ignores: ['.next/', '.turbo/', 'public/'],
    }
];