import {addDecorator, addParameters} from '@storybook/react';
import {withA11y} from '@storybook/addon-a11y';
import {addReadme} from 'storybook-readme';

addDecorator(withA11y);
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
