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
                const namespace = page.split('.')[0];
                const module = help?.module[namespace] || `ut-${namespace}`;
                window.open(help[page] || `${help.default}/${module}/help/${page}`, '_blank');
            }
        };
    }
});
