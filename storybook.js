const immutable = require('immutable');

const main = async(config, name, path, params, handlers, dependencies) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#${path}`);

    const {portsMap: {'utPortal.ui': {container}}, serviceBus: {publicApi: {importMethod}}} = await require('ut-run').run({
        main: (...params) => [
            require('ut-login')(...params),
            require('ut-browser')(...params),
            ...dependencies,
            function mock() {
                return {
                    browser: [
                        function backend() {
                            return {
                                namespace: Array.from(new Set(Object.entries(handlers).map(
                                    ([method, handler]) => handler && method.split('.')[0]
                                ).filter(Boolean))),
                                send(params, {method}) {
                                    return handlers[method] ? params : super.send(...arguments);
                                },
                                receive(result, {method}) {
                                    return handlers[method] ? result : super.receive(...arguments);
                                },
                                ...handlers
                            };
                        }
                    ]
                };
            },
            require('./browser')(...params)
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
    const page = await importMethod('component/' + name)({});
    page.path = path;
    page.params = params;
    page.Component = await page.component(params);
    return {
        page({theme = 'dark', backend}) {
            return container({
                theme: {
                    ut: {
                        classes: {}
                    },
                    palette: {
                        type: theme,
                        background: {
                            // even: 'red'
                        }
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
                            },
                            'permission.get': [{
                                actionId: 'granted'
                            }, {
                                actionId: 'page%'
                            }]
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

const organization = [
    {value: 100, label: 'Africa'},
    {value: 300, label: 'Asia'},
    {value: 400, label: 'Australia'},
    {value: 500, label: 'Europe'},
    {value: 600, label: 'North America'},
    {value: 700, label: 'South America'},
    {value: 101, parents: 100, label: 'Egypt'},
    {value: 102, parents: 100, label: 'Kenya'},
    {value: 103, parents: 100, label: 'Ghana'},
    {value: 104, parents: 100, label: 'Nigeria'},
    {value: 301, parents: 300, label: 'Philippines'},
    {value: 302, parents: 300, label: 'India'},
    {value: 501, parents: 500, label: 'Bulgaria'},
    {value: 601, parents: 600, label: 'USA'},
    {value: 701, parents: 700, label: 'Mexico'}
];

module.exports.app = (config = {}, mock, dependencies = []) => (name, id, params) => {
    mock = mock && {
        'core.translation.fetch': () => ({}),
        'customer.dropdown.list': () => ({
            'customer.organization': organization
        }),
        'customer.organization.graphFetch': () => ({
            organization: organization.map(({value: id, label: title, ...org}) => ({id, title, ...org}))
        }),
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
    result.loaders = [() => main(config, name, '/' + path, mainParams, mock, dependencies)];
    return result;
};
