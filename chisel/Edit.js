// @ts-check
import React from 'react';
import Editor from 'ut-front-devextreme/core/Editor';

export default ({
    subject,
    object,
    resultSet,
    keyField,
    typeField,
    properties,
    cards,
    layouts,
    addMethod,
    editMethod,
    getMethod,
    nested
}) => {
    /** @type { import("..").libFactory } */
    const editor = ({
        utMeta,
        import: {
            [addMethod]: objectAdd,
            [editMethod]: objectEdit,
            [getMethod]: objectGet,
            portalDropdownList
        },
        lib: {
            editors
        }
    }) => ({
        editor({id, type, layout: layoutName = type}) {
            const props = {
                object,
                id,
                properties,
                editors,
                type,
                typeField,
                cards,
                layouts,
                layoutName,
                nested,
                keyField,
                resultSet,
                onDropdown: names => portalDropdownList(names, utMeta()),
                onAdd: params => objectAdd(params, utMeta()),
                onGet: params => objectGet(params, utMeta()),
                onEdit: params => objectEdit(params, utMeta())
            };
            return function Edit() {
                return <Editor {...props}/>;
            };
        }
    });
    return editor;
};
