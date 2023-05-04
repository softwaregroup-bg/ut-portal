const playwright = require('@playwright/test');

module.exports = {
    ...playwright,
    test: playwright.test.extend({
        username: ['', {scope: 'worker', option: true}],
        password: ['', {scope: 'worker', option: true}],
        loginPageUrl: ['', {scope: 'worker', option: true}],
        async portal({page, context, username, password, loginPageUrl}, use) {
            context.clearCookies();
            page.on('console', msg => {
                // eslint-disable-next-line no-console
                if (msg.type() === 'error') console.log(msg.text());
            });
            await page.goto(loginPageUrl);
            await page.click('input[name="username"]');
            await page.fill('input[name="username"]', username);
            await page.click('input[name="password"]');
            await page.fill('input[name="password"]', password);
            await Promise.all([
                page.waitForNavigation(),
                page.click('button:has-text("Login")')
            ]);
            await use(page);
        }
    })
};
