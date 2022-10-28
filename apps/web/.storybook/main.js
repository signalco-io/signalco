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
        'storybook-addon-next'
    ],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5'
    },
    staticDirs: ['../public'],
    features: {
        emotionAlias: false,
        storyStoreV7: true,
        lazyCompilation: true,
        fsCache: true
    }
}
