require('ut-run').run({
    method: 'types',
    main: () => [[{
        main: require.resolve('./'),
        pkg: require.resolve('./package.json')
    }], [{
        main: require.resolve('ut-db'),
        pkg: require.resolve('ut-db/package.json')
    }]],
    config: {
        utPortal: true,
        utRun: {
            types: {
                dependencies: 'core',
                validation: 'utPortal.validation',
                error: 'utPortal.error'
            }
        }
    }
});
