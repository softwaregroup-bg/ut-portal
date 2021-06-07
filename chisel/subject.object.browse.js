// @ts-check
import React from 'react';
import Explorer from 'ut-front-devextreme/core/Explorer';
import Navigator from 'ut-front-devextreme/core/Navigator';

export default ({navigator, subject, object, keyField, fields, cards}) =>
    /** @type { import("../handlers").handlerFactory } */
    ({
        import: {
            handleTabShow,
            customerOrganizationGraphFetch,
            [`component/${subject}.${object}.new`]: objectNew,
            [`${subject}.${object}.fetch`]: objectFetch,
            [`component/${subject}.${object}.open`]: objectOpen,
            [`${subject}.${object}.delete`]: objectDelete
        }
    }) => {
        const BrowserComponent = async() => {
            const defaults = {
                name: {
                    action: ({id}) => handleTabShow([objectOpen, {id}])
                }
            };
            fields = (cards?.browse?.fields || ['name']).reduce((prev, name) => [
                ...prev,
                {field: name, ...defaults[name], ...fields[name]}
            ], []);
            const details = {name: 'Name'};
            function Browse() {
                const [tenant, setTenant] = React.useState(null);
                return (
                    <Explorer
                        fetch={(!navigator || tenant != null) && objectFetch}
                        keyField={keyField}
                        fields={fields}
                        details={details}
                        filter={navigator ? {tenant} : {}}
                        actions={[{
                            title: 'Create',
                            permission: `${subject}.${object}.add`,
                            action: () => handleTabShow(objectNew)
                        }, {
                            title: 'Edit',
                            permission: `${subject}.${object}.edit`,
                            enabled: 'current',
                            action: ({id}) => handleTabShow([objectOpen, {id}])
                        }, {
                            title: 'Delete',
                            enabled: 'selected',
                            action: ({selected}) => objectDelete(selected)
                        }]}
                    >
                        {navigator && <Navigator
                            fetch={customerOrganizationGraphFetch}
                            onSelect={setTenant}
                            keyField='id'
                            field='title'
                            title='Tenant'
                            resultSet='organization'
                        />}
                    </Explorer>
                );
            };
            return Browse;
        };
        return {
            [`${subject}.${object}.browse`]: () => ({
                title: `${object} list`,
                permission: `${subject}.${object}.browse`,
                component: BrowserComponent
            })
        };
    };
