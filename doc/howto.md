# ut-portal how to

## How to create menu item action dynamically

Use this in the menu:

```js
{
    title: 'Organization list',
    async action() {
        const layout = 'test'; // calculate layout conditionally
        return {
            type: 'front.tab.show',
            path: `/customer.organization.browse?layout=${layout}`,
            params: {
                layout
            },
            ...await component$customerOrganizationBrowse({})
        };
    }
}
```
