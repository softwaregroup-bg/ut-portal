/* eslint-disable no-process-env */
// @ts-check

const {resolve} = require('path');
const rc = require('ut-config').load({config: {params: {appname: 'ut_playwright_dev'}}});

/** @type {import('@playwright/test').PlaywrightTestConfig<{ username: string, password: string }>} */
const config = {
    retries: 1,
    updateSnapshots: rc.updateSnapshots,
    use: {
        trace: 'on-first-retry',
        ...process.env.CHROME_BIN && {
            launchOptions: {
                executablePath: process.env.CHROME_BIN
            }
        },
        colorScheme: 'dark',
        baseURL: process.env.UT_URL || rc.url,
        viewport: { width: 1600, height: 900 },
        username: process.env.UT_USERNAME || String(rc.username),
        password: process.env.UT_PASSWORD || String(rc.password)
    },
    testDir: resolve('.').replaceAll('\\', '/'),
    testMatch: /.*\.play\.(js|ts|mjs)/,
    outputDir: resolve('.lint/playwright'),
    reporter: [
        [process.env.CI ? 'dot' : 'list'],
        ['html', { open: 'never', outputFolder: resolve('.lint/playwright-unit') }],
        ['junit', { outputFile: resolve('.lint/playwright-unit.xml') }]
    ]
};

module.exports = config;
