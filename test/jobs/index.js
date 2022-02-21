module.exports = [
    function ui() {
        return {
            portal: function(test, bus, run) {
                return run(test, bus, [
                    'portal.playwright.run'
                ]);
            }
        };
    }
];
