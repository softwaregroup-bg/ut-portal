#!/usr/bin/env node
/* eslint-disable no-console */
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

const setStatus = async(state, description, url) => {
    const token = process.env.GITLAB_STATUS_TOKEN;
    const projectId = String(process.env.GIT_URL).match(/git@git\.softwaregroup\.com:(ut5(?:impl)?\/.*)\.git/)?.[1];
    if (token && projectId) {
        await got.post(`https://git.softwaregroup.com/api/v4/projects/${encodeURIComponent(projectId)}/statuses/${process.env.GIT_COMMIT}`, {
            json: {
                state,
                name: 'UI Review',
                description,
                target_url: url
            },
            headers: {
                'PRIVATE-TOKEN': token
            }
        });
        return true;
    }
    return false;
};

const DETAILS = /View build details at (.*)$/;

program
    .command('publish')
    .description('Publish storybook')
    .allowUnknownOption()
    .allowExcessArguments()
    .action(async(_, {args}) => {
        console.log('Publishing storybook...');
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
        const details = result.stdout.toString().match(DETAILS);
        if (result.error || result.status || result.signal) {
            // eslint-disable-next-line no-process-exit
            if (!await setStatus('failed', details?.[0], details?.[1])) process.exit(1);
        } else {
            await setStatus('success', details?.[0], details?.[1]);
        }
    });

program.parse();
