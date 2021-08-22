const playwrightMiddleware = require('storybook-addon-playwright/middleware').default;
const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('ut-config').load({config:{params: {appname: 'ut_portal_dev'}}});

module.exports = function expressMiddleware(router) {
    const proxyConfig = config.proxy || {};
    for (const domain in proxyConfig) {
        if (typeof proxyConfig[domain] === 'string') {
            router.use(domain, createProxyMiddleware(domain, {
                target: proxyConfig[domain],
                changeOrigin: true
            }));
        } else {
            router.use(domain, createProxyMiddleware(domain, proxyConfig[domain]));
        }
    }
    playwrightMiddleware(router);
}
