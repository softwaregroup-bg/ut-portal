// @ts-check
import React from 'react';
import Explorer from 'ut-front-devextreme/core/Explorer';
import Navigator from 'ut-front-devextreme/core/Navigator';

export default ({subject, object, keyField}) =>
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
            const fields = [{
                field: 'name',
                title: 'Name',
                filter: true,
                action: ({id}) => handleTabShow([objectOpen, {id}])
            }];
            const details = {name: 'Name'};
            function Browse() {
                const [tenant, setTenant] = React.useState(null);
                return (
                    <Explorer
                        fetch={tenant != null && objectFetch}
                        keyField={keyField}
                        fields={fields}
                        details={details}
                        filter={{tenant}}
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
                        <Navigator
                            fetch={customerOrganizationGraphFetch}
                            onSelect={setTenant}
                            keyField='id'
                            field='title'
                            title='Tenant'
                            resultSet='organization'
                        />
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
