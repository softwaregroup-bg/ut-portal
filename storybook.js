const React = require('react');
const classes = require('./storybook.module.css');

const merge = require('ut-function.merge');

const main = async(config, name, path, params, handlers, dependencies, portal, backend) => {
    // fix: Storybook tries to keep the old hash, which we do not want
    history.replaceState({}, '', `#${path}`);

    const {portsMap: {'utPortal.ui': {container}}, serviceBus: {publicApi: {importMethod}}} = await require('ut-run').run({
        main: (...layerParams) => [
            require('ut-login')(...layerParams),
            require('ut-browser')(...layerParams),
            ...dependencies,
            require('./browser')(...layerParams),
            portal,
            function mock() {
                return {
                    browser: [
                        function backend() {
                            return {
                                namespace: Array.from(new Set(Object.entries(handlers).map(
                                    ([method, handler]) => handler && method.split('.')[0]
                                ).filter(Boolean))),
                                send(methodParams, {method}) {
                                    return this.methods.imported[method] ? methodParams : super.send(...arguments);
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
                'storybook',
                backend
            ].filter(Boolean),
            utBrowser: true,
            utPortal: true,
            utLogin: true,
            mock: true
        }, config],
        method: 'debug'
    });
    const login = merge({
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
            }, {
                actionId: '%.add'
            }, {
                actionId: '%.edit'
            }, {
                actionId: '%.delete'
            }]
        }
    }, await handlers?.login?.());
    if (portal) {
        const portalParams = await importMethod('portal.params.get')({});
        portalParams.state = portalParams.state || {};
        portalParams.state.login = login;
        return {
            page() {
                return container(portalParams);
            }
        };
    }
    const page = !name.startsWith('p/') && await importMethod('component/' + name)({});
    if (page) {
        page.path = path;
        page.params = params;
        page.Component = await page.component(params);
    }
    return {
        page({theme = 'dark-compact', dir}) {
            return container({
                theme: {
                    dir,
                    name: theme,
                    ut: {
                        classes
                    },
                    languages: {
                        ar: {
                            lastPageLabel: '',
                            passwordPrompt: 'أدخل كلمة المرور',
                            Login: 'تسجيل الدخول',
                            'Login with password': 'تسجيل الدخول بكلمة مرور',
                            Register: 'يسجل',
                            'Registration page': 'صفحة التسجيل',
                            Username: 'اسم المستخدم',
                            Password: 'كلمة المرور',
                            startsWith: 'Starts with',
                            contains: 'Contains',
                            notContains: 'Not contains',
                            endsWith: 'Ends with',
                            equals: 'Equals',
                            notEquals: 'Not equals',
                            noFilter: 'No Filter',
                            filter: 'Filter',
                            lt: 'Less than',
                            lte: 'Less than or equal to',
                            gt: 'Greater than',
                            gte: 'Greater than or equal to',
                            dateIs: 'Date is',
                            dateIsNot: 'Date is not',
                            dateBefore: 'Date is before',
                            dateAfter: 'Date is after',
                            custom: 'Custom',
                            clear: 'Clear',
                            apply: 'Apply',
                            matchAll: 'Match All',
                            matchAny: 'Match Any',
                            addRule: 'Add Rule',
                            removeRule: 'Remove Rule',
                            accept: 'Yes',
                            reject: 'No',
                            choose: 'Choose',
                            upload: 'Upload',
                            cancel: 'Cancel',
                            close: 'Close',
                            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                            dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                            today: 'Today',
                            weekHeader: 'Wk',
                            firstDayOfWeek: 0,
                            dateFormat: 'mm/dd/yy',
                            weak: 'Weak',
                            medium: 'Medium',
                            strong: 'Strong',
                            emptyFilterMessage: 'No available options',
                            emptyMessage: 'No results found',
                            aria: {
                                trueLabel: 'True',
                                falseLabel: 'False',
                                nullLabel: 'Not Selected',
                                pageLabel: 'Page',
                                firstPageLabel: 'First Page',
                                lastPageLabel: 'Last Page',
                                nextPageLabel: 'Next Page',
                                previousPageLabel: 'Previous Page',
                                selectLabel: 'Select',
                                unselectLabel: 'Unselect',
                                expandLabel: 'Expand',
                                collapseLabel: 'Collapse'
                            }
                        },
                        bg: {
                            passwordPrompt: 'Въведете парола',
                            Login: 'Вход',
                            'Login with password': 'Вход с парола',
                            Register: 'Регистрация',
                            'Registration page': 'Страница за регистрация',
                            Username: 'Потребител',
                            Password: 'Парола',
                            accept: 'Да',
                            reject: 'Не',
                            choose: 'Избор',
                            upload: 'Качване',
                            cancel: 'Отказ',
                            dayNames: ['Неделя', 'Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота'],
                            dayNamesShort: ['Нед', 'Пон', 'Вто', 'Сря', 'Чет', 'Пет', 'Съб'],
                            dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                            monthNames: ['Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни', 'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември'],
                            monthNamesShort: ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
                            today: 'Днес',
                            clear: 'Изчистване',
                            weekHeader: 'Сд',
                            firstDayOfWeek: 1,
                            dateFormat: 'dd/mm/yyyy',
                            weak: 'Слаба',
                            medium: 'Средна',
                            strong: 'Добра',
                            startsWith: 'Започва с',
                            contains: 'Съдържа',
                            notContains: 'Не съдържа',
                            endsWith: 'Завършва на',
                            equals: 'Равно е на',
                            notEquals: 'Не е равно на',
                            noFilter: 'Без филтър',
                            lt: 'По-малко от',
                            lte: 'По-малко или равно на',
                            gt: 'По-голямо от',
                            gte: 'По-голямо или равно на',
                            dateIs: 'Датата е',
                            dateIsNot: 'Дататата не е',
                            dateBefore: 'Датата е преди',
                            dateAfter: 'Датата е след',
                            custom: 'Персонализиран',
                            apply: 'Приложи',
                            matchAll: 'Съвпадение на всички',
                            matchAny: 'Съвпадение на някое ',
                            addRule: 'Добавяне на условие',
                            removeRule: 'Премахване на условие',
                            emptyFilterMessage: 'Няма налична информация',
                            emptyMessage: 'Не са открити резултати'
                        }
                    },
                    palette: {
                        type: theme.split('-')[0],
                        background: {
                            // even: 'red'
                        }
                    }
                },
                devTool: true,
                portalName: 'Test Portal',
                state: {
                    error: {},
                    login,
                    portal: {
                        menu: [{
                            title: ' 🏠 ',
                            id: 'home',
                            action: () => ({type: 'test'})
                        }],
                        tabs: [page]
                    }
                }
            });
        }
    };
};

const Page = ({globals, config, name, mainParams, mock, path, dependencies, portal}) => {
    const [page, setPage] = React.useState(null);
    React.useEffect(() => {
        async function loadPage() {
            const {page} = await main(config, name, '/' + path, mainParams, mock, dependencies, portal, globals.backend);
            setPage(page(globals));
        }
        loadPage();
    }, [config, dependencies, globals, mainParams, mock, name, path, portal]);
    return page;
};

exports.app = (config = {}, mock, dependencies = [], portal) => (name, id, params) => {
    mock = mock && {
        'core.portal.get': () => ({
            configuration: {
                'portal.utPrime.GMap': {
                    key: process.env.STORYBOOK_GMAP_KEY || '', // eslint-disable-line no-process-env
                    region: 'BG'
                }
            }
        }),
        'core.component.get': () => ({component: null}),
        ...mock
    };
    const result = (args, {globals}) => React.createElement(Page, {
        globals,
        config,
        name,
        mainParams,
        mock,
        path,
        dependencies,
        portal,
        key: globals.backend + globals.dir + globals.theme
    });
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
    result.parameters = {chromatic: { delay: 5000 }};
    return result;
};
