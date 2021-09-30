const treeFamily = [
    {value: 10, label: 'Adoxaceae'},
    {value: 11, label: 'Araliaceae'},
    {value: 12, label: 'Araucariaceae'},
    {value: 13, label: 'Asphodelaceae'},
    {value: 14, label: 'Betulaceae'},
    {value: 15, label: 'Cornaceae'},
    {value: 16, label: 'Cupressaceae'},
    {value: 17, label: 'Ericaceae'},
    {value: 18, label: 'Fabaceae'},
    {value: 19, label: 'Fagaceae'},
    {value: 20, label: 'Myrtaceae'},
    {value: 21, label: 'Moraceae'},
    {value: 22, label: 'Pinaceae'},
    {value: 23, label: 'Proteaceae'},
    {value: 24, label: 'Rosaceae'},
    {value: 25, label: 'Salicaceae'},
    {value: 26, label: 'Sapindaceae'},
    {value: 27, label: 'Taxaceae'},
    {value: 28, label: 'Ulmaceae'}
];

const threeCol = 'p-lg-6 p-xl-4';

export const tree = joi => ({
    joi,
    subject: 'microservice',
    object: 'tree',
    browser: {
        navigator: true,
        create: [{
            title: 'Add'
        }, {
            title: 'Add conifer',
            type: 'conifer'
        }, {
            title: 'Add broadleaf',
            type: 'broadleaf'
        }]
    },
    properties: {
        treeName: {
            title: 'Name'
        },
        familyId: {
            title: 'Family',
            editor: {
                type: 'dropdown', options: treeFamily
            }
        },
        maleCone: {
            title: 'Male Cone'
        },
        femaleCone: {
            title: 'Female Cone'
        },
        flowerDescription: {
            title: 'Flower'
        },
        fruitName: {
            title: 'Fruit'
        },
        treeImages: {
            items: {
                imageTitle: {
                    title: 'Title'
                },
                imageUrl: {
                    title: 'Image'
                }
            },
            editor: {type: 'table', columns: ['imageTitle', 'imageUrl']}
        },
        habitatMap: {
            title: 'Habitat'
        },
        links: {
            items: {
                linkUrl: {
                    title: 'URL'
                },
                linkTitle: {
                    title: 'Title'
                }
            },
            editor: {type: 'table', columns: ['linkUrl', 'linkTitle']}
        }
    },
    cards: {
        edit: {
            title: 'Identification',
            properties: ['treeName', 'treeDescription', 'familyId']
        },
        morphology: {
            title: 'Morphology'
        },
        cone: {
            title: 'Cone',
            properties: ['maleCone', 'femaleCone']
        },
        fruit: {
            title: 'Fruit',
            properties: ['flowerDescription', 'fruitName']
        },
        col1: {
            title: 'Column 1',
            properties: ['treeName'],
            className: threeCol
        },
        col2: {
            title: 'Column 2',
            properties: ['treeDescription'],
            className: threeCol
        },
        col3: {
            title: 'Column 3',
            properties: ['familyId'],
            className: threeCol
        },
        images: {
            properties: ['treeImages']
        },
        map: {
            properties: ['habitatMap']
        },
        links: {
            title: 'Links',
            properties: ['links']
        },
        attachments: {
            title: 'Attachments',
            properties: ['attachments']
        }
    },
    layouts: {
        editConifer: ['edit', 'cone'],
        editBroadleaf: ['edit', 'fruit'],
        editFlat: ['edit', 'cone', 'fruit'],
        editNested: ['edit', ['cone', 'fruit']],
        edit3col: ['col1', 'col2', 'col3'],
        editThumbIndex: [{
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
            icon: 'pi pi-images',
            items: [{
                label: 'Images',
                cards: ['images']
            }]
        }, {
            icon: 'pi pi-map',
            items: [{
                label: 'Habitat',
                cards: ['map']
            }]
        }, {
            icon: 'pi pi-paperclip',
            items: [{
                label: 'Links',
                cards: ['links', 'attachments']
            }]
        }]
    },
    reports: {
        list: {
            validation: joi?.object(),
            params: ['treeName', 'familyId'],
            columns: ['treeName', 'treeDescription'],
            fetch: 'microservice.tree.report'
        }
    }
});

export const treeMock = {};
