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
        function getActions(setFilter) {
            remove = remove || (instances => ({[keyField]: instances.map(instance => (instance[keyField]))}));
            const handleDelete = async({selected}) => {
                try {
                    return await objectDelete(remove(selected), utMeta());
                } finally {
                    setFilter(prev => ({...prev}));
                }
            };
            return [...create.map(({
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
        }
        const BrowserComponent = async() => {
            function Browse() {
                const [tenant, setTenant] = React.useState(null);
                const [filter, setFilter] = React.useState(navigator ? {[tenantField]: tenant} : {});
                const actions = React.useMemo(() => getActions(setFilter), [setFilter]);
                return (
                    <Explorer
                        fetch={(!navigator || tenant != null) && handleFetch}
                        resultSet={resultSet || object}
                        keyField={keyField}
                        properties={properties}
                        columns={columns}
                        details={details}
                        filter={filter}
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
