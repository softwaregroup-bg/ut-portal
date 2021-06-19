// @ts-check
import React from 'react';
import Explorer from 'ut-front-devextreme/core/Explorer';
import Navigator from 'ut-front-devextreme/core/Navigator';
import merge from 'ut-function.merge';

export default ({
    subject,
    object,
    keyField,
    nameField,
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
        utMeta,
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
            [nameField]: {
                action: ({id}) => handleTabShow([objectOpen, {id}], utMeta())
            }
        };
        const details = {[nameField]: 'Name'};
        fields = ((cards && cards.browse && cards.browse.fields) || [nameField]).reduce((prev, name) => [
            ...prev,
            merge({field: name}, defaults[name], fields[name])
        ], []);
        const handleFetch = (typeof fetch === 'function') ? params => objectFetch(fetch(params)) : objectFetch;
        remove = remove || (instances => ({[keyField]: instances.map(instance => ({value: instance[keyField]}))}));
        const handleDelete = ({selected}) => objectDelete(remove(selected));
        const actions = [{
            title: 'Create',
            permission: `${subject}.${object}.add`,
            action: () => handleTabShow(objectNew, utMeta())
        }, {
            title: 'Edit',
            permission: `${subject}.${object}.edit`,
            enabled: 'current',
            action: ({id}) => handleTabShow([objectOpen, {id}], utMeta())
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
