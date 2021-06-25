import {app} from '../storybook';
import chisel from '../chisel';

export default {
    title: 'Microservice'
};

const page = app({
    implementation: 'microservice',
    utMicroservice: true,
    utCore: true
}, {
    'core.translation.fetch': () => ({}),
    'customer.organization.graphFetch': () => ({
        organization: [
            {id: 100, title: 'Africa'},
            {id: 300, title: 'Asia'},
            {id: 400, title: 'Australia'},
            {id: 500, title: 'Europe'},
            {id: 600, title: 'North America'},
            {id: 700, title: 'South America'},
            {id: 101, parents: 100, title: 'Egypt'},
            {id: 102, parents: 100, title: 'Kenya'},
            {id: 103, parents: 100, title: 'Ghana'},
            {id: 104, parents: 100, title: 'Nigeria'},
            {id: 301, parents: 300, title: 'Philippines'},
            {id: 302, parents: 300, title: 'India'},
            {id: 501, parents: 500, title: 'Bulgaria'},
            {id: 601, parents: 600, title: 'USA'},
            {id: 701, parents: 700, title: 'Mexico'}
        ]
    }),
    ...chisel({subject: 'microservice', object: 'tree'}).mock()
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
                        ...chisel({
                            joi,
                            subject: 'microservice',
                            object: 'tree',
                            browser: {
                                navigator: true,
                                create: [{
                                    title: 'Add'
                                }, {
                                    title: 'Add confier',
                                    type: 'conifer'
                                }, {
                                    title: 'Add broadleaf',
                                    type: 'broadleaf'
                                }]
                            },
                            layouts: {
                                editConifer: ['edit', 'conifer'],
                                editBroadleaf: ['edit', 'broadleaf'],
                                edit: [{
                                    icon: 'pi pi-file',
                                    items: [{
                                        label: 'Main',
                                        cards: ['edit', 'morphology'],
                                        items: [
                                            {label: 'Identification'},
                                            {label: 'Morphology'}
                                        ]
                                    }, {
                                        label: 'Taxonomy',
                                        cards: ['classification', 'clsLinks'],
                                        items: [
                                            {label: 'Classification'},
                                            {label: 'Links'}
                                        ]
                                    }]
                                }, {
                                    icon: 'pi pi-images'
                                }, {
                                    icon: 'pi pi-map'
                                }, {
                                    icon: 'pi pi-paperclip'
                                }]
                            }
                        }).components()
                    ];
                }
            ]
        };
    }
]);

export const TreeBrowse = page('microservice.tree.browse');
export const TreeOpen = page('microservice.tree.open', 101);
export const TreeNew = page('microservice.tree.new');
export const TreeNewConifer = page('microservice.tree.new', {type: 'conifer'});
export const TreeNewBroadleaf = page('microservice.tree.new', {type: 'broadleaf'});
