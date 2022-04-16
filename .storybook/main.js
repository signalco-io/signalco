module.exports = {
    stories: [
        '../components/**/*.stories.mdx',
        '../components/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-a11y',
        '@storybook/addon-storysource',
        'storycap',
        'storybook-addon-performance/register',
        'storybook-addon-next'
    ],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5'
    },
    staticDirs: ['../public'],
    features: { emotionAlias: false }
}
