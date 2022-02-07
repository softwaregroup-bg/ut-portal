#!/usr/bin/env node
/* eslint-disable no-process-env */

const { program } = require('commander');
const { spawnSync } = require('child_process');
const { resolve } = require('path');
const got = require('got');

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

const setStatus = async state => {
    const token = process.env.GITLAB_STATUS_TOKEN;
    const projectId = String(process.env.GIT_URL).match(/git@git\.softwaregroup\.com:ut5(?:impl)?\/(.*)\.git/)?.[1];
    if (token && projectId) {
        await got.post(`https://git.softwaregroup.com/api/v4/projects/${encodeURIComponent(projectId)}/statuses/${process.env.GIT_COMMIT}`, {
            json: {
                state,
                name: 'UI Review'
            },
            headers: {
                'PRIVATE-TOKEN': token
            }
        });
        return true;
    }
    return false;
};

program
    .command('publish')
    .description('Publish storybook')
    .allowUnknownOption()
    .allowExcessArguments()
    .action(async(_, {args}) => {
        await setStatus('running');
        const result = spawnSync(
            process.argv[0],
            [
                resolve(require.resolve('chromatic/package.json'), '..', require('chromatic/package.json').bin.chromatic),
                '-d',
                '.lint/storybook',
                '--exit-zero-on-changes master',
                '--exit-once-uploaded master',
                ...args
            ], {
                stdio: 'inherit'
            }
        );
        if (result.error) {
            // eslint-disable-next-line no-process-exit
            if (!await setStatus('failed')) process.exit(result.error);
        } else {
            await setStatus('success');
        }
    });

program.parse();
