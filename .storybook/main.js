module.exports = {
    webpackFinal: (config) => {
        config.module.rules.forEach(rule => {
            if (rule.exclude && rule.exclude.toString() === '/node_modules/') {
                rule.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
                rule.include.push(/node_modules[\\/]ut-/i)
            }
        });
        config.plugins.forEach(plugin => {
            if (plugin?.options?.exclude?.toString().startsWith('/node_modules/')) {
                plugin.options.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
            }
        });
        config.watchOptions = {
            ignored: /node_modules[\\/](?!(impl|ut)-)/
        };

        const empty = require.resolve('./empty');
        config.resolve.alias['dtrace-provider'] = empty;
        config.resolve.alias['fs'] = empty;
        config.resolve.alias['safe-json-stringify'] = empty;
        config.resolve.alias['mv'] = empty;
        config.resolve.alias['source-map-support'] = empty;
        config.resolve.alias['bufferutil'] = empty;
        return config;
    },
    reactOptions: {
        fastRefresh: true
    },
    typescript: {
        check: false,
        reactDocgen: false,
    },
    stories: [process.cwd().replace(/\\/g, '/') + '/portal/**/*.stories.js'],
    addons: [
        'storybook-readme',
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-viewport',
        '@storybook/addon-a11y',
        '@storybook/addon-storysource',
    ],
};
