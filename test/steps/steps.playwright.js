const { spawn } = require('child_process');
const { resolve, dirname } = require('path');

const exec = async(command, args, options) => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, options);
        process.on('error', err => reject(err));
        process.on('exit', (code, signal) => code || signal ? reject(new Error(`${command} ${args.join(' ')} exited with code ${code} and signal ${signal}`)) : resolve(true));
    });
};

module.exports = function steps({version, callSite, utBus}) {
    return {
        'steps.portal.playwright.run'(userStep = 'playwright.credentials') {
            return {
                ...callSite?.(),
                name: 'run playwright',
                steps: () => {
                    return [
                        // eslint-disable-next-line no-process-env
                        process.env.UT_USERNAME && 'Generate admin user',
                        {
                            name: 'run playwright',
                            params: ({
                                generateAdmin: {
                                    hash: {
                                        identifier
                                    }
                                },
                                [userStep]: {
                                    username = identifier,
                                    password = '123'
                                } = {
                                    // eslint-disable-next-line no-process-env
                                    username: process.env.UT_USERNAME,
                                    // eslint-disable-next-line no-process-env
                                    password: process.env.UT_PASSWORD
                                },
                                ...rest
                            }) => exec(
                                '"' + process.execPath + '"',
                                [
                                    resolve(
                                        dirname(require.resolve('@playwright/test/package.json')),
                                        require('@playwright/test/package.json').bin.playwright
                                    ),
                                    'test',
                                    '-c',
                                    require.resolve('./playwright.config')
                                ].concat(
                                    Object.entries(rest)
                                        .filter(([key]) => /\.playwright$/.test(key))
                                        .map(([, value]) => value.__dirname.replace(/\\/g, '/'))
                                        .filter(Boolean)
                                ).concat(
                                    Object.entries(utBus.config.playwright || {})
                                        .map(([key, value]) => value === true ? `--${key}` : [`--${key}`, `${value}`])
                                        .flat()
                                ),
                                {
                                    stdio: 'inherit',
                                    shell: true,
                                    env: {
                                        UT_URL: utBus.info().uri,
                                        UT_USERNAME: username,
                                        UT_PASSWORD: password,
                                        // eslint-disable-next-line no-process-env
                                        ...process.env
                                    }
                                }
                            ),
                            result(result, assert) {
                                assert.ok(result, 'Playwright run without error');
                            }
                        }
                    ].filter(Boolean);
                }
            };
        }
    };
};
