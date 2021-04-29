#!/usr/bin/env node

const { program } = require('commander');
const { spawnSync } = require('child_process');
const { resolve } = require('path');

program
    .command('storybook')
    .description('Start storybook portal')
    .allowUnknownOption()
    .allowExcessArguments()
    .action((_, {args}) => {
        spawnSync(
            process.argv[0],
            [
                resolve(require.resolve('@storybook/react/package.json'), '..', require('@storybook/react/package.json').bin['start-storybook']),
                '-c',
                resolve(__dirname, '..', '.storybook'),
                ...args
            ], {
                stdio: 'inherit'
            }
        );
    });

program
    .command('build')
    .description('Build storybook')
    .allowUnknownOption()
    .allowExcessArguments()
    .action((_, {args}) => {
        spawnSync(
            process.argv[0],
            [
                resolve(require.resolve('@storybook/react/package.json'), '..', require('@storybook/react/package.json').bin['build-storybook']),
                '--quiet',
                '-c',
                resolve(__dirname, '..', '.storybook'),
                '-o',
                '.lint/storybook',
                ...args
            ], {
                stdio: 'inherit'
            }
        );
    });

program
    .command('publish')
    .description('Publish storybook')
    .allowUnknownOption()
    .allowExcessArguments()
    .action((_, {args}) => {
        spawnSync(
            process.argv[0],
            [
                resolve(require.resolve('chromatic/package.json'), '..', require('chromatic/package.json').bin.chromatic),
                '-d',
                '.lint/storybook',
                '--exit-zero-on-changes',
                '--exit-once-uploaded',
                ...args
            ], {
                stdio: 'inherit'
            }
        );
    });

program.parse();
