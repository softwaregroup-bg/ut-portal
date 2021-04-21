module.exports = {
    webpackFinal: (config) => {
        config.module.rules.forEach(rule => {
            if (rule.exclude && rule.exclude.toString() === '/node_modules/') {
                rule.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
                rule.include.push(/node_modules[\\/]ut-/i)
            }
            if (rule && rule.test && rule.test.toString() === '/\\.css$/') {
                rule.use[1].options = rule.use[1].options || {};
                rule.use[1].options.modules = rule.use[1].options.modules || {}
                rule.use[1].options.modules.auto = /\.module\.css$|node_modules[/\\]ut-.+\.css|(?:^\/app\/|impl-[^/\\]+[/\\])(?!node_modules[/\\]).+\.css$/;
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
        config.optimization.concatenateModules = false;
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
        {
            name: '@storybook/addon-postcss',
            options: {
                postcssLoaderOptions: {
                    postcssOptions: {
                        plugins: [
                            require('postcss-import')({path: [__dirname]}),
                            require('postcss-preset-env')({preserve: false}),
                            require('postcss-assets')({relative: true}),
                            require('postcss-merge-rules')(),
                            require('postcss-clean')({level: 2, rebase: false})
                        ]
                    }
                }
            }
        },
        '@storybook/addon-a11y',
        '@storybook/addon-storysource',
    ],
};
