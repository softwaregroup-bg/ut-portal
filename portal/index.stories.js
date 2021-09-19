import {app} from '../storybook';
import chisel from '../chisel';
import {tree, treeMock} from './tree';

export default {
    title: 'Chisel'
};

const organization = [
    {value: 100, label: 'Africa'},
    {value: 300, label: 'Asia'},
    {value: 400, label: 'Australia'},
    {value: 500, label: 'Europe'},
    {value: 600, label: 'North America'},
    {value: 700, label: 'South America'},
    {value: 101, parents: 100, label: 'Egypt'},
    {value: 102, parents: 100, label: 'Kenya'},
    {value: 103, parents: 100, label: 'Ghana'},
    {value: 104, parents: 100, label: 'Nigeria'},
    {value: 301, parents: 300, label: 'Philippines'},
    {value: 302, parents: 300, label: 'India'},
    {value: 501, parents: 500, label: 'Bulgaria'},
    {value: 601, parents: 600, label: 'USA'},
    {value: 701, parents: 700, label: 'Mexico'}
];

const page = app({
    implementation: 'microservice',
    utMicroservice: true,
    utCore: true
}, {
    'customer.organization.graphFetch': () => ({
        organization: organization.map(({value: id, label: title, ...org}) => ({id, title, ...org}))
    }),
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
export const TreeOpenThumbIndex = page('microservice.tree.open', 101, {layout: 'thumbIndex'});
const treeNew = 'microservice.tree.new';
export const TreeNew = page(treeNew);
export const TreeNewConifer = page(treeNew, {type: 'conifer'});
export const TreeNewBroadleaf = page(treeNew, {type: 'broadleaf'});
export const TreeNewFlat = page(treeNew, {layout: 'flat'});
export const TreeNewNested = page(treeNew, {layout: 'nested'});
export const TreeNew3Col = page(treeNew, {layout: '3col'});
export const TreeNewThumbIndex = page(treeNew, {layout: 'thumbIndex'});
export const TreeReport = page('microservice.tree.report', 'list');
