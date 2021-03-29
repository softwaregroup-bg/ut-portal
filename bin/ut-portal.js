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
            'start-storybook',
            [
                '-c',
                resolve(__dirname, '..', '.storybook'),
                ...args
            ], {
                stdio: 'inherit',
                shell: true
            }
        );
    });

program.parse();
