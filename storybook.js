const dispatch = require('ut-function.dispatch');
const immutable = require('immutable');

const main = async(config, name, id, mock, dependencies) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#/${name}${id ? '/' + id : ''}`);

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
    page.path = '/' + name + (id ? '/' + id : '');
    page.params = {id};
    page.Component = await page.component({id});
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
                    login: immutable.fromJS({
                        profile: {
                            initials: 'SA'
                        },
                        result: {
                            'identity.check': {
                                actorId: 1
                            },
                            person: {
                                firstName: 'Super',
                                lastName: 'Admin'
                            }
                        }
                    }),
                    portal: {
                        menu: [{title: ' 📚 '}],
                        tabs: [page]
                    }
                }
            });
        }
    };
};

module.exports.app = (config = {}, mock = {}, dependencies = []) => (name, id) => {
    const result = (args, {loaded: {page}}) => page();
    result.loaders = [() => main(config, name, id, mock, dependencies)];
    result.storyName = name + (id ? '/' + id : '');
    return result;
};
