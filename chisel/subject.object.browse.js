// @ts-check
import React from 'react';
import Explorer from 'ut-front-devextreme/core/Explorer';
import Navigator from 'ut-front-devextreme/core/Navigator';
import merge from 'ut-function.merge';

export default ({
    subject,
    object,
    resultSet,
    objectTitle,
    keyField,
    nameField,
    tenantField,
    properties,
    cards,
    layouts,
    title = cards?.browse?.title || `${objectTitle} list`,
    fetch,
    create = [{
        title: 'Create'
    }],
    delete: remove,
    navigator,
    fetchMethod,
    deleteMethod,
    navigatorFetchMethod = 'customerOrganizationGraphFetch'
}) =>
    /** @type { import("../handlers").handlerFactory } */
    ({
        utMeta,
        import: {
            handleTabShow,
            [navigatorFetchMethod]: navigatorFetch,
            [`component/${subject}.${object}.new`]: objectNew,
            [`component/${subject}.${object}.open`]: objectOpen,
            [fetchMethod]: objectFetch,
            [deleteMethod]: objectDelete
        }
    }) => {
        properties = merge({
            [nameField]: {
                action: ({id}) => handleTabShow([objectOpen, {id}], utMeta())
            }
        }, properties);
        const details = {[nameField]: 'Name'};
        const columns = ((cards?.browse?.properties) || [nameField]);
        const handleFetch = (typeof fetch === 'function') ? params => objectFetch(fetch(params), utMeta()) : params => objectFetch(params, utMeta());
        const handleNavigatorFetch = params => navigatorFetch(params, utMeta());
        remove = remove || (instances => ({[keyField]: instances.map(instance => ({value: instance[keyField]}))}));
        const handleDelete = ({selected}) => objectDelete(remove(selected));
        const actions = [...create.map(({
            type,
            permission = `${subject}.${object}.add`,
            ...rest
        }) => ({
            action: () => type ? handleTabShow([objectNew, {type}], utMeta()) : handleTabShow(objectNew, utMeta()),
            permission,
            ...rest
        })), {
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
                        resultSet={resultSet || object}
                        keyField={keyField}
                        properties={properties}
                        columns={columns}
                        details={details}
                        filter={navigator ? {[tenantField]: tenant} : {}}
                        actions={actions}
                    >
                        {navigator && <Navigator
                            fetch={handleNavigatorFetch}
                            onSelect={setTenant}
                            keyField='id'
                            field='title'
                            title={properties?.[tenantField]?.title || 'Tenant'}
                            resultSet='organization'
                        />}
                    </Explorer>
                );
            };
            return Browse;
        };
        return {
            [`${subject}.${object}.browse`]: () => ({
                title,
                permission: `${subject}.${object}.browse`,
                component: BrowserComponent
            })
        };
    };
