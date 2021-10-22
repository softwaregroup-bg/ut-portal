import React from 'react';
import {app} from '../storybook';

export default {
    title: 'Portal'
};

const page = app({
    implementation: 'portal',
    utPortal: true,
    utCore: true
}, {
}, [
    function utPortal() {
        return {
            config: () => ({
                storybook: {
                    browser: true
                }
            }),
            browser: () => [
                function component() {
                    return [
                        () => ({
                            namespace: 'component/portal',
                            'portal.demo.open': () => ({
                                title: 'Demo page title',
                                component: () => {
                                    return function page() {
                                        return <div>Demo page body</div>;
                                    };
                                }
                            })
                        })
                    ];
                }
            ]
        };
    }
]);

export const TreeBrowse = page('portal.demo.open');
