// @ts-check
export default ({subject, object}) =>
    /** @type { import("..").pageFactory<{}, {}> } */
    function subjectObjectNew({
        lib: {
            editor
        }
    }) {
        return {
            [`${subject}.${object}.new`]: () => ({
                title: `Create ${object}`,
                permission: `${subject}.${object}.add`,
                component: editor
            })
        };
    };
