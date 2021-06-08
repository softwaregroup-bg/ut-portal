// @ts-check
import React from 'react';

import Editor from 'ut-front-devextreme/core/Editor';
import {Toolbar, Button} from 'ut-front-devextreme/core/prime';

export default ({
    subject,
    object,
    keyField,
    fields,
    cards,
    addMethod,
    editMethod,
    getMethod
}) => {
    /** @type { import("../handlers").libFactory } */
    const editor = ({
        import: {
            [addMethod]: objectAdd,
            [editMethod]: objectEdit,
            [getMethod]: objectGet
        }
    }) => ({
        editor({id}) {
            async function handleSubmit(instance) {
                if (id != null) {
                    await objectEdit({[object]: instance});
                } else {
                    instance = await objectAdd({[object]: instance});
                    id = instance[keyField];
                }
            }
            async function handleGet() {
                const result = (await objectGet({[keyField]: id}))[object];
                return Array.isArray(result) ? result[0] : result;
            }
            return function Edit() {
                const trigger = React.useRef(null);
                return (
                    <>
                        <Toolbar
                            left={
                                <Button icon='pi pi-save' onClick={() => trigger && trigger.current && trigger.current()}/>
                            }
                        />
                        <Editor
                            style={{
                                flexGrow: 3,
                                overflowY: 'auto',
                                height: '100%'
                            }}
                            fields={fields}
                            cards={cards}
                            onSubmit={handleSubmit}
                            get={handleGet}
                            trigger={trigger}
                        />
                    </>
                );
            };
        }
    });
    return editor;
};
