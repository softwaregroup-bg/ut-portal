// @ts-check
import React from 'react';

import Editor from 'ut-front-devextreme/core/Editor';
import ThumbIndex from 'ut-front-devextreme/core/ThumbIndex';
import {Toolbar, Button} from 'ut-front-devextreme/core/prime';

import {capital} from './lib';

export default ({
    subject,
    object,
    keyField,
    typeField,
    fields,
    cards,
    layouts,
    addMethod,
    editMethod,
    getMethod
}) => {
    /** @type { import("../handlers").libFactory } */
    const editor = ({
        utMeta,
        import: {
            [addMethod]: objectAdd,
            [editMethod]: objectEdit,
            [getMethod]: objectGet
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
                const [[index, layout], setIndex] = React.useState(getLayout(type));
                async function get() {
                    let result = (await objectGet({[keyField]: id}, utMeta()))[object];
                    if (Array.isArray(result)) result = result[0];
                    if (typeField) setIndex(getLayout(result[typeField]));
                    setValue(result);
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
                const [filter, setFilter] = React.useState(index?.[0]?.items?.[0]);
                React.useEffect(() => { if (id) get(); }, []);
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
                                fields={fields}
                                cards={cards}
                                layout={layout || filter?.cards || []}
                                onSubmit={handleSubmit}
                                value={value}
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
