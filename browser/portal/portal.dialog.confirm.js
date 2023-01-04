const {confirmDialog} = require('ut-prime/core/prime');

/** @type { import("../..").handlerFactory } */
module.exports = () => ({
    'portal.dialog.confirm'(params) {
        return new Promise((resolve, reject) =>
            confirmDialog({
                icon: 'pi pi-exclamation-triangle',
                header: 'Confirmation',
                ...typeof params === 'string' ? {message: params} : params,
                reject: () => reject(new Error('silent')),
                onHide: () => reject(new Error('silent')),
                accept: resolve
            })
        );
    }
});
