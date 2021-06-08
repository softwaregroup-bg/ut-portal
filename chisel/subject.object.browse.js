// @ts-check
import React from 'react';
import Explorer from 'ut-front-devextreme/core/Explorer';
import Navigator from 'ut-front-devextreme/core/Navigator';

export default ({
    subject,
    object,
    keyField,
    fields,
    cards,
    fetch,
    delete: remove,
    navigator,
    fetchMethod,
    deleteMethod
}) =>
    /** @type { import("../handlers").handlerFactory } */
    ({
        import: {
            handleTabShow,
            customerOrganizationGraphFetch,
            [`component/${subject}.${object}.new`]: objectNew,
            [`component/${subject}.${object}.open`]: objectOpen,
            [fetchMethod]: objectFetch,
            [deleteMethod]: objectDelete
        }
    }) => {
        const defaults = {
            name: {
                action: ({id}) => handleTabShow([objectOpen, {id}])
            }
        };
        const details = {name: 'Name'};
        fields = ((cards && cards.browse && cards.browse.fields) || ['name']).reduce((prev, name) => [
            ...prev,
            {field: name, ...defaults[name], ...fields[name]}
        ], []);
        const handleFetch = (typeof fetch === 'function') ? params => objectFetch(fetch(params)) : objectFetch;
        remove = remove || (instances => ({[keyField]: instances.map(instance => ({value: instance[keyField]}))}));
        const handleDelete = ({selected}) => objectDelete(remove(selected));
        const actions = [{
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
            action: handleDelete
        }];
        const BrowserComponent = async() => {
            function Browse() {
                const [tenant, setTenant] = React.useState(null);
                return (
                    <Explorer
                        fetch={(!navigator || tenant != null) && handleFetch}
                        resultSet={object}
                        keyField={keyField}
                        fields={fields}
                        details={details}
                        filter={navigator ? {tenant} : {}}
                        actions={actions}
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
