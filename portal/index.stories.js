import {app} from '../storybook';
import chisel from '../chisel';
import {tree, treeMock} from './tree';

export default {
    title: 'Chisel'
};

const page = app({
    implementation: 'microservice',
    utMicroservice: true,
    utCore: true
}, {
    ...chisel(tree()).mock(treeMock)
}, [
    function utMicroservice() {
        return {
            config: () => ({
                storybook: {
                    browser: true
                }
            }),
            browser: () => [
                function component({joi}) {
                    return [
                        () => ({ namespace: 'component/microservice' }),
                        ...chisel(tree(joi)).components()
                    ];
                }
            ]
        };
    }
]);

export const TreeBrowse = page('microservice.tree.browse');
export const TreeOpen = page('microservice.tree.open', 101);
export const TreeOpenThumbindex = page('microservice.tree.open', 101, {layout: 'thumbindex'});
export const TreeNew = page('microservice.tree.new');
export const TreeNewConifer = page('microservice.tree.new', {type: 'conifer'});
export const TreeNewBroadleaf = page('microservice.tree.new', {type: 'broadleaf'});
export const TreeNewFlat = page('microservice.tree.new', {layout: 'flat'});
export const TreeNewNested = page('microservice.tree.new', {layout: 'nested'});
export const TreeNew3Col = page('microservice.tree.new', {layout: '3col'});
export const TreeNewThumbindex = page('microservice.tree.new', {layout: 'thumbindex'});
export const TreeReport = page('microservice.tree.report', 'list');
