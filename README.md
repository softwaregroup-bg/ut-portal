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

## API

- `handle.tab.show({tab, params})` - Shows a new tab
- `portal.menu.item(definition)` or `portal.menu.item({component, id , title})` -
  Define a menu item, which when clicked opens a page.
  - `definition` - Component definition function
  - `component` - React component function
  - `id` - Passed as the `id` property to the component
    function
  - `title` - Title of the menu

## Portal menu

Rebuild
To provide configuration for the portal, include it in
a portal configuration module after `ut-portal`:

```js
module.exports = (...params) => [
    // other modules,
    require('ut-portal')(...params),
    require('ut-portal-hello')(...params)
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

Implement a `portal.params.get` handler function named `portal`.
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
        component$microserviceFooNew,
        component$microserviceFooBrowse,
        component$microserviceFooOpen,
        portalMenuItem
    }
}) {
    return {
        async 'portal.params.get'() {
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
                    items: [
                        await portalMenuItem(component$microserviceFooNew),
                        await portalMenuItem(component$microserviceFooBrowse),
                        await portalMenuItem({
                            component: component$microserviceFooOpen,
                            id: 1,
                            title: 'Open Foo 1'
                        })
                    ]
                }]
            };
        }
    };
};
```

## Portal pages

Portal pages open as tabs in the UI. Portal pages are usually defined
in dedicated files with the standard structure for defining handlers.
The handler function should return an object, as shown below:

```js
// @ts-check
import React from 'react';

/** @type { import("../../handlers").handlerFactory } */
export default ({
    import: {
    }
}) => ({
    'subject.object.predicate': () => ({
        title: 'Page title',
        permission: 'some.permission.id',
        component:() => function ComponentName {
            return (
                <div>Page content</div>
            );
        }

    })
});
```
