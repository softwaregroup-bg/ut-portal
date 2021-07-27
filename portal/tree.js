export const tree = joi => ({
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
    properties: {
        treeName: {
            title: 'Name'
        },
        familyId: {
            title: 'Family',
            editor: {
                type: 'dropdown'
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
        }
    },
    cards: {
        edit: {
            title: 'Tree',
            properties: ['treeName', 'treeDescription', 'familyId']
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
            className: 'p-lg-6 p-xl-4'
        },
        col2: {
            title: 'Column 2',
            properties: ['treeDescription'],
            className: 'p-lg-6 p-xl-4'
        },
        col3: {
            title: 'Column 3',
            properties: ['familyId'],
            className: 'p-lg-6 p-xl-4'
        }
    },
    layouts: {
        editConifer: ['edit', 'cone'],
        editBroadleaf: ['edit', 'fruit'],
        editFlat: ['edit', 'cone', 'fruit'],
        editNested: ['edit', ['cone', 'fruit']],
        edit3col: ['col1', 'col2', 'col3'],
        editThumbindex: [{
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
});

export const treeMock = {};
