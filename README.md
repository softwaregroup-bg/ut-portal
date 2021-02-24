# Microservice portal

Create portals in a modular way

## Project links

- [Continuous Integration (Jenkins)](https://jenkins.softwaregroup.com/view/master/job/ut/job/ut-portal/)
- [Static Code Analysis (SonarQube)](https://sonar.softwaregroup.com/dashboard?id=ut-portal%3Aorigin%2Fmaster)

## Usage

Include `ut-portal` in your browser build INSTEAD of `ut-front-react`:

```js
// usually this is in browser/index.js or portal/index.js
module.exports = (...params) => [
    require('ut-portal')(...params),
    // other modules
]
```

## Portal menu

To provide configuration for the portal, include it in
a portal configuration module after `ut-portal`:

```js
module.exports = (...params) => [
    require('ut-portal')(...params),
    require('ut-portal-hello')(...params),
    // other modules
]
```

Then in `ut-portal-hello`, create a `browser` layer that returns handlers.

```js
// browser.js
module.exports = () => function utPortalHello() {
    return {
        browser: () => [
            require('./portal.params.get')
        ]
    };
};
```

Implement a `portal.params.get` handler a function named `portal`.
The handler can reference components from other modules by using
one of the destructuring syntaxes:

- `import:{component$subjectObjectPredicate}`
- `import:{'component/x.y.z': componentXyz}`

Then these components can be attached to the portal menu items:

```js
// portal.params.get.js
const classes = require('./admin.css');

module.exports = function portal({
    import: {
        component$microserviceFooOpen,
        component$microserviceFooBrowse
    }
}) {
    return {
        'portal.params.get'() {
            return {
                // return the theme parameters
                theme: {
                    ut: {
                        classes
                    }
                },
                // return the portal name
                portalName: 'Hello Portal',
                // return the portal menu
                menu: [{
                    title: 'Hello Menu',
                    items: [{
                        title: 'Browse',
                        page: component$microserviceFooBrowse
                    }, {
                        title: 'Open',
                        page: component$microserviceFooOpen
                    }]
                }]
            };
        }
    };
};
```
