const { spawnSync } = require('child_process');

module.exports = function steps({version, callSite, utBus}) {
    return {
        'steps.portal.playwright.run'() {
            return {
                ...callSite?.(),
                name: 'run playwright',
                steps: () => {
                    return [
                        'Generate admin user',
                        {
                            name: 'run playwright',
                            params: ({
                                generateAdmin: {
                                    hash: {
                                        identifier: username
                                    }
                                },
                                ...rest
                            }) => spawnSync(
                                'playwright',
                                [
                                    'test',
                                    '--config',
                                    require.resolve('./playwright.config')
                                ].concat(
                                    Object.entries(rest)
                                        .filter(([key]) => /\.playwright$/.test(key))
                                        .map(([, value]) => value.__dirname)
                                        .filter(Boolean)
                                ),
                                {
                                    stdio: 'inherit',
                                    env: {
                                        // eslint-disable-next-line no-process-env
                                        ...process.env,
                                        UT_URL: utBus.info().uri,
                                        UT_USERNAME: username,
                                        UT_PASSWORD: '123'
                                    }
                                }
                            ),
                            result(result, assert) {
                                assert.ok(!result.status && !result.signal, 'Playwright run without error');
                            }
                        }
                    ];
                }
            };
        }
    };
};
