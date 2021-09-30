const immutable = require('immutable');
const merge = require('ut-function.merge');

const main = async(config, name, path, params, handlers, dependencies, portal) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#${path}`);

    const {portsMap: {'utPortal.ui': {container}}, serviceBus: {publicApi: {importMethod}}} = await require('ut-run').run({
        main: (...params) => [
            require('ut-login')(...params),
            require('ut-browser')(...params),
            ...dependencies,
            require('./browser')(...params),
            portal,
            function mock() {
                return {
                    browser: [
                        function backend() {
                            return {
                                namespace: Array.from(new Set(Object.entries(handlers).map(
                                    ([method, handler]) => handler && method.split('.')[0]
                                ).filter(Boolean))),
                                send(params, {method}) {
                                    return this.methods.imported[method] ? params : super.send(...arguments);
                                },
                                receive(result, {method}) {
                                    return this.methods.imported[method] ? result : super.receive(...arguments);
                                },
                                ...handlers
                            };
                        }
                    ]
                };
            }
        ].filter(Boolean),
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
            utPortal: true,
            utLogin: true,
            mock: true
        }, config],
        method: 'debug'
    });
    const login = immutable.fromJS(merge({
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
            },
            'permission.get': [{
                actionId: 'granted'
            }, {
                actionId: 'page%'
            }]
        }
    }, await handlers?.login?.()));
    if (portal) {
        const params = await importMethod('portal.params.get')({});
        params.state = params.state || {};
        params.state.login = login;
        return {
            page({theme = 'dark', backend}) {
                return container(params);
            }
        };
    }
    const page = await importMethod('component/' + name)({});
    page.path = path;
    page.params = params;
    page.Component = await page.component(params);
    return {
        page({theme = 'dark', backend}) {
            return container({
                theme: {
                    name: theme,
                    ut: {
                        classes: {}
                    },
                    palette: {
                        type: theme.split('-')[0],
                        background: {
                            // even: 'red'
                        }
                    }
                },
                portalName: 'Test Portal',
                state: {
                    error: {},
                    login,
                    portal: {
                        menu: [{title: ' 📚 '}],
                        tabs: [page]
                    }
                }
            });
        }
    };
};

module.exports.app = (config = {}, mock, dependencies = [], portal) => (name, id, params) => {
    mock = mock && {
        'core.translation.fetch': () => ({}),
        ...mock
    };
    const result = (args, {loaded: {page}, globals}) => page(globals);
    if (id && typeof id === 'object') {
        params = id;
        id = undefined;
    }
    const mainParams = {id};
    if (params) {
        Object.assign(mainParams, params);
        params = new URLSearchParams(params);
        params.sort();
        params = '?' + params;
    } else params = '';
    const path = name + ((id != null) ? '/' + id : '') + params;
    result.storyName = path;
    result.loaders = [() => main(config, name, '/' + path, mainParams, mock, dependencies, portal)];
    return result;
};
