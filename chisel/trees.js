const trees = [
    'Acacia       | https://en.wikipedia.org/wiki/Acacia',
    'Banksia      | https://en.wikipedia.org/wiki/Banksia',
    'Cedar        | https://en.wikipedia.org/wiki/Cedrus',
    'Dogwood      | https://en.wikipedia.org/wiki/Cornus',
    'Elm          | https://en.wikipedia.org/wiki/Elm',
    'Fig          | https://en.wikipedia.org/wiki/Ficus',
    'Gum          | https://en.wikipedia.org/wiki/Eucalyptus',
    'Hazel        | https://en.wikipedia.org/wiki/Hazel',
    'Ivy          | https://en.wikipedia.org/wiki/Hedera',
    'Juniper      | https://en.wikipedia.org/wiki/Juniper',
    'Kauri        | https://en.wikipedia.org/wiki/Agathis',
    'Larch        | https://en.wikipedia.org/wiki/Larch',
    'Maple        | https://en.wikipedia.org/wiki/Maple',
    'Narra        | https://en.wikipedia.org/wiki/Pterocarpus_indicus',
    'Oak          | https://en.wikipedia.org/wiki/Oak',
    'Pine         | https://en.wikipedia.org/wiki/Pine',
    'Quercus      | https://en.wikipedia.org/wiki/Oak',
    'Rowan        | https://en.wikipedia.org/wiki/Rowan',
    'Sycamore     | https://en.wikipedia.org/wiki/Acer_pseudoplatanus',
    'Tamarind     | https://en.wikipedia.org/wiki/Tamarind',
    'Unedo        | https://en.wikipedia.org/wiki/Arbutus_unedo',
    'Viburnum     | https://en.wikipedia.org/wiki/Viburnum',
    'Willow       | https://en.wikipedia.org/wiki/Willow',
    'Xanthorrhoea | https://en.wikipedia.org/wiki/Xanthorrhoea',
    'Yew          | https://en.wikipedia.org/wiki/Taxus',
    'Zelkova      | https://en.wikipedia.org/wiki/Zelkova'
];

export default ({
    keyField,
    nameField,
    tenantField
}) => trees.map((tree, index) => {
    const [name, wiki] = tree.split('|').map(string => string.trim());
    return {
        [keyField]: 101 + index,
        [nameField]: name,
        ...tenantField && {[tenantField]: 100},
        links: [{
            linkTitle: 'Wikipedia',
            linkUrl: wiki
        }]
    };
});
