const { setConfig } = require('storybook-addon-playwright/configs');
const lazy = /(devextreme[/\\]dist[/\\]css[/\\]dx\.(?!common).+\.css$)|(primereact[/\\]resources[/\\]themes[/\\].+\.css$)/i;

module.exports = {
    // TODO consider https://www.npmjs.com/package/neutrino-middleware-storybook
    webpackFinal: (config) => {
        const cssRule = config.module.rules.findIndex(rule => rule && rule.test && rule.test.toString() === '/\\.css$/');
        if (cssRule > -1) {
            config.module.rules.splice(cssRule, 0, {
                test: lazy,
                use: [{
                    loader: config.module.rules[cssRule].use[0].loader,
                    options: {
                        injectType: 'lazyStyleTag'
                    }
                }, {
                    loader: config.module.rules[cssRule].use[1].loader,
                }]
            });
        }
        config.module.rules.forEach(rule => {
            if (rule.exclude && rule.exclude.toString() === '/node_modules/') {
                rule.exclude = /node_modules[\\/](?!(impl|ut)-)/i;
                rule.include.push(/node_modules[\\/]ut-/i)
            }
            if (rule && rule.test && rule.test.toString() === '/\\.css$/') {
                rule.exclude = lazy;
                rule.use[1].options = rule.use[1].options || {};
                rule.use[1].options.modules = rule.use[1].options.modules || {}
                rule.use[1].options.modules.auto = /\.module\.css$|node_modules[/\\]ut-.+\.css|(?:^\/app\/|impl-[^/\\]+[/\\])(?!node_modules[/\\]).+\.css$/;
            }
        });
        // config.module.rules.push({
        //     test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        //     exclude: /@babel(?:\/|\\{1,2})runtime/,
        //     enforce: "pre",
        //     use: ["source-map-loader"]
        // });
        // config.devtool = 'source-map';
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
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/addon-knobs',
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
    // core: {
    //     builder: 'storybook-builder-vite',
    // },
    async viteFinal(config, { configType }) {
        // customize the Vite config here
        debugger;
        config.plugins.splice(2, 1);
        config.server.fsServe.root = 'K:/ut';
        return config;
    },
};

const browser = {};
setConfig({
    storybookEndpoint: `http://localhost:6006/`,
    async getPage(browserType, options) {
        const playwright = require('playwright');
        if (!browser[browserType]) browser[browserType] = await playwright['chromium'].launch();
        return await browser[browserType].newPage(options);
    },
    async afterScreenshot(page) {
        await page.close();
    }
});
