// @ts-check
// @ts-ignore
const defaultIcon = require('./favicon.ico').default;

/** @type { import("../..").handlerFactory } */
module.exports = ({
    config: {
        favicon,
        title
    } = {}
}) => ({
    async start() {
        if (typeof document === 'undefined') return;
        const head = document.getElementsByTagName('head')[0];
        head.innerHTML = `${head.innerHTML}<link href="${favicon || defaultIcon}" rel="icon" type="image/x-icon" />`;
        document.title = title || 'Standard';
    }
});
