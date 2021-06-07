// @ts-check
import React from 'react';

import Editor from 'ut-front-devextreme/core/Editor';
import {Toolbar, Button} from 'ut-front-devextreme/core/prime';

export default ({subject, object, keyField, fields, cards}) => {
    /** @type { import("../handlers").libFactory } */
    const editor = ({
        import: {
            [`${subject}.${object}.add`]: add,
            [`${subject}.${object}.edit`]: edit,
            [`${subject}.${object}.get`]: get
        }
    }) => ({
        editor({id}) {
            async function handleSubmit(instance) {
                if (id != null) {
                    await edit(instance);
                } else {
                    instance = await add(instance);
                    id = instance[keyField];
                }
            }
            function handleGet() {
                return get({[keyField]: id});
            }
            return function Edit() {
                const trigger = React.useRef(null);
                return (
                    <>
                        <Toolbar
                            left={
                                <Button icon='pi pi-save' onClick={() => trigger?.current?.()}/>
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
