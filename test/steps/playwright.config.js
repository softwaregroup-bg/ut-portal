/* eslint-disable no-process-env */
// @ts-check

const {resolve} = require('path');

/** @type {import('@playwright/test').PlaywrightTestConfig<{ username: string, password: string }>} */
const config = {
    use: {
        ...process.env.CHROME_BIN && {
            launchOptions: {
                executablePath: process.env.CHROME_BIN
            }
        },
        baseURL: process.env.UT_URL,
        viewport: { width: 1600, height: 900 },
        username: process.env.UT_USERNAME,
        password: process.env.UT_PASSWORD
    },
    testDir: resolve('.'),
    testMatch: /.*\.play\.(js|ts|mjs)/,
    outputDir: '.lint/playwright',
    reporter: [
        [process.env.CI ? 'dot' : 'list'],
        ['html', { open: 'never', outputFolder: '.lint/playwright-unit' }],
        ['junit', { outputFile: '.lint/playwright-unit.xml' }]
    ]
};

module.exports = config;
