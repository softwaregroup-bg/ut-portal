// @ts-check
import React from 'react';
import Report from 'ut-front-devextreme/core/Report';

export default ({
    subject,
    object,
    title,
    reports,
    properties,
    cards
}) =>
    /** @type { import("../handlers").handlerFactory } */
    ({
        utMeta,
        utMethod,
        import: {
            portalDropdownList
        }
    }) => {
        return {
            [`${subject}.${object}.report`]: () => ({
                title,
                permission: `${subject}.${object}.report`,
                component: async({id}) => {
                    const props = {
                        properties,
                        params: reports[id]?.params,
                        validation: reports[id]?.validation,
                        columns: reports[id]?.columns,
                        resultSet: 'resultSet' in reports[id] ? reports[id].resultSet : object,
                        onDropdown: names => portalDropdownList(names, utMeta()),
                        fetch: params => utMethod(reports[id].fetchMethod)(params, utMeta())
                    };
                    return function ReportComponent() {
                        return <Report {...props}/>;
                    };
                }
            })
        };
    };
