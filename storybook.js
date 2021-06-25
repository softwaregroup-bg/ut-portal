const dispatch = require('ut-function.dispatch');
const immutable = require('immutable');

const main = async(config, name, path, params, mock, dependencies) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#${path}`);

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
    page.path = path;
    page.params = params;
    page.Component = await page.component(params);
    return {
        page() {
            return container({
                theme: {
                    ut: {
                        classes: {}
                    },
                    palette: {
                        type: 'dark',
                        background: {
                            even: 'red'
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

module.exports.app = (config = {}, mock = {}, dependencies = []) => (name, id, params) => {
    mock = {
        'core.translation.fetch': () => ({}),
        'customer.organization.graphFetch': () => ({
            organization: [
                {id: 100, title: 'Africa'},
                {id: 300, title: 'Asia'},
                {id: 400, title: 'Australia'},
                {id: 500, title: 'Europe'},
                {id: 600, title: 'North America'},
                {id: 700, title: 'South America'},
                {id: 101, parents: 100, title: 'Egypt'},
                {id: 102, parents: 100, title: 'Kenya'},
                {id: 103, parents: 100, title: 'Ghana'},
                {id: 104, parents: 100, title: 'Nigeria'},
                {id: 301, parents: 300, title: 'Philippines'},
                {id: 302, parents: 300, title: 'India'},
                {id: 501, parents: 500, title: 'Bulgaria'},
                {id: 601, parents: 600, title: 'USA'},
                {id: 701, parents: 700, title: 'Mexico'}
            ]
        }),
        ...mock
    };
    const result = (args, {loaded: {page}}) => page();
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
