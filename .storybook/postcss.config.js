module.exports = {
    plugins: [
        require('postcss-import')({path: [__dirname]}),
        require('postcss-preset-env')({preserve: false}),
        require('postcss-assets')({relative: true}),
        require('postcss-merge-rules')(),
        require('postcss-clean')({level: 2, rebase: false})
    ]
};
