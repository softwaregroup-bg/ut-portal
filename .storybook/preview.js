import {addDecorator, addParameters} from '@storybook/react';
import {addReadme} from 'storybook-readme';

addDecorator(addReadme);
addParameters({
    layout: 'fullscreen',
    readme: {
        codeTheme: 'github',
        StoryPreview: ({
            children
        }) => children,
    },
});

export const globalTypes = {
    // TODO - finish handling
    backend: {
        name: 'Back end',
        description: 'Back end API mock',
        defaultValue: 'mock',
        toolbar: {
            icon: 'database',
            items: ['mock', 'admin', 'solution', 'selfservice', 'cms', 'localhost'],
            showName: false
        }
    },
    theme: {
        name: 'Theme',
        description: 'Theme',
        defaultValue: 'dark',
        toolbar: {
            icon: 'eye',
            items: ['dark', 'light', 'dark-compact', 'light-compact'],
            showName: false
        }
    }
}

export const decorators = [
    (Story, {globals: {backend, theme}}) => (
        <Story {...{backend, theme}} />
    )
];
