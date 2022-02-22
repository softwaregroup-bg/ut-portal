// @ts-check

/** @type { import("../../handlers").handlerFactory } */
module.exports = ({
    config: {
        help
    } = {}
}) => ({
    'portal.menu.help'(params) {
        return help && {
            title: 'Help',
            action: () => {
                const page = window.location.hash.replace(/^#?\/?/g, '').split('/')[0];
                window.open(help[page] || `${help.default}#${page}`, '_blank');
            }
        };
    }
});
