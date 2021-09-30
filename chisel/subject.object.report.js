// @ts-check
import React from 'react';
import Report from 'ut-front-devextreme/core/Report';

export default ({
    subject,
    object,
    report: {
        title
    },
    reports,
    properties,
    cards
}) =>
    /** @type { import("..").pageFactory<{}, {}> } */
    function subjectObjectReport({
        utMeta,
        utMethod,
        import: {
            portalDropdownList
        }
    }) {
        return {
            [`${subject}.${object}.report`]: () => ({
                title,
                permission: `${subject}.${object}.report`,
                component: async({id}) => {
                    const props = {
                        properties,
                        params: reports[id]?.params,
                        validation: reports[id]?.validation,
                        columns: reports[id]?.columns || cards?.browse?.properties,
                        resultSet: reports?.[id]?.resultSet == null ? object : reports[id].resultSet,
                        onDropdown: names => portalDropdownList(names, utMeta()),
                        fetch: params => utMethod(reports?.[id]?.fetch || `${subject}.${object}.fetch`)(params, utMeta())
                    };
                    return function ReportComponent() {
                        return <Report {...props}/>;
                    };
                }
            })
        };
    };
