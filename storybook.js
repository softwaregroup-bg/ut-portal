const dispatch = require('ut-function.dispatch');

const main = async(config, name, mock, dependencies) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#/${name}`);

    const {portsMap: {'utPortal.ui': {container}}, serviceBus: {publicApi: {importMethod}}} = await require('ut-run').run({
        main: (...params) => [
            require('ut-browser')(...params),
            () => ({
                browser: () => [
                    dispatch(mock)
                ]
            }),
            ...dependencies,
            require('./browser')(...params)
        ],
        config: [{
            service: 'browser',
            repl: false,
            debug: true,
            browser: true,
            run: {
                logLevel: 'debug'
            },
            utPort: {
                logLevel: 'debug'
            },
            utLog: {
                streams: {
                    udp: false
                }
            },
            utBus: {
                serviceBus: {
                    logLevel: 'trace',
                    socket: false
                }
            },
            configFilenames: [
                'common',
                'storybook'
            ],
            utBrowser: true,
            utPortal: true
        }, config],
        method: 'debug'
    });
    const page = await importMethod('component/' + name)({});
    page.path = '/' + name;
    page.Component = await page.component();
    return {
        page() {
            return container({
                theme: {
                    ut: {
                        classes: {}
                    },
                    palette: {
                        type: 'dark'
                    }
                },
                portalName: 'Test Portal',
                state: {
                    error: {},
                    login: {},
                    portal: {
                        menu: [],
                        tabs: [page]
                    }
                }
            });
        }
    };
};

module.exports.app = (config = {}, mock = {}, dependencies = []) => name => {
    const result = (args, {loaded: {page}}) => page();
    result.loaders = [() => main(config, name, mock, dependencies)];
    result.storyName = name;
    return result;
};
