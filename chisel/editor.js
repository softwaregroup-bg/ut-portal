// @ts-check
import React from 'react';
import lodashGet from 'lodash.get';

import Editor from 'ut-front-devextreme/core/Editor';
import ThumbIndex from 'ut-front-devextreme/core/ThumbIndex';
import {Toolbar, Button} from 'ut-front-devextreme/core/prime';

import {capital} from './lib';

export default ({
    subject,
    object,
    resultSet = object,
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
    /** @type { import("../handlers").libFactory } */
    const editor = ({
        utMeta,
        import: {
            [addMethod]: objectAdd,
            [editMethod]: objectEdit,
            [getMethod]: objectGet,
            portalDropdownList
        }
    }) => ({
        editor({id, type}) {
            function getLayout(name = '') {
                let index = layouts?.['edit' + capital(name)];
                let layout;
                if (typeof index?.[0] === 'string') {
                    layout = index;
                    index = false;
                } else layout = !index && ['edit' + capital(name)];
                return [index, layout];
            }
            return function Edit() {
                const trigger = React.useRef(null);
                const [value, setValue] = React.useState({});
                const [dropdown, setDropdown] = React.useState({});
                const [[index, layout], setIndex] = React.useState(getLayout(type));
                const [filter, setFilter] = React.useState(index?.[0]?.items?.[0]);
                const dropdowns = (layout || filter?.cards || [])
                    .flat()
                    .map(card => cards?.[card]?.properties)
                    .flat()
                    .filter(Boolean)
                    .map(name => lodashGet(properties, name?.replace(/\./g, '.properties.'))?.editor?.dropdown)
                    .filter(Boolean);
                async function get() {
                    let result = (await objectGet({[keyField]: id}, utMeta()));
                    if (nested) {
                        result = nested.reduce((prev, field) => ({
                            ...prev,
                            [field]: properties[field]?.properties ? [].concat(result[field])[0] : result[field]
                        }), {});
                    } else {
                        result = result[resultSet];
                        if (Array.isArray(result)) result = result[0];
                    }
                    if (typeField) setIndex(getLayout(result[typeField]));
                    setDropdown(await portalDropdownList(dropdowns, utMeta()));
                    setValue(result);
                }
                async function init() {
                    setDropdown(await portalDropdownList(dropdowns, utMeta()));
                }
                async function handleSubmit(instance) {
                    if (id != null) {
                        await objectEdit({[object]: instance}, utMeta());
                    } else {
                        instance = await objectAdd({[object]: instance}, utMeta());
                        id = instance[keyField];
                        setValue(instance);
                    }
                }
                React.useEffect(() => {
                    if (id) get();
                    else init();
                }, []);
                return (
                    <>
                        <Toolbar
                            left={
                                <Button icon='pi pi-save' onClick={() => trigger?.current?.()}/>
                            }
                        />
                        <div className='p-grid' style={{overflowX: 'hidden', width: '100%'}}>
                            {index && <ThumbIndex index={index} onFilter={setFilter}/>}
                            <Editor
                                properties={properties}
                                cards={cards}
                                layout={layout || filter?.cards || []}
                                onSubmit={handleSubmit}
                                value={value}
                                dropdown={dropdown}
                                trigger={trigger}
                            />
                        </div>
                    </>
                );
            };
        }
    });
    return editor;
};
