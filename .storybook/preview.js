if(process.env.NODE_ENV === 'production') require('./preview.global.css');

export const parameters = ({
    layout: 'fullscreen',
    readme: {
        theme: {
            textColor: 'white',
            barBg: '#2b2b2b'
        },
        codeTheme: 'a11y-dark',
        StoryPreview: ({children}) => children,
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
        defaultValue: 'dark-compact',
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
