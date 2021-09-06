// @ts-check
export default ({subject, object}) =>
    /** @type { import("..").pageFactory<{}, {}> } */
    ({
        lib: {
            editor
        }
    }) => ({
        [`${subject}.${object}.open`]: () => ({
            title: `Edit ${object}`,
            permission: `${subject}.${object}.get`,
            component: editor
        })
    });
