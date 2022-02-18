#!/usr/bin/env node
/* eslint-disable no-process-exit */
/* eslint-disable no-console */
/* eslint-disable no-process-env */

const { program } = require('commander');
const { spawnSync, spawn } = require('child_process');
const { resolve } = require('path');
const got = require('got');
const split = require('split2');

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
        await got.post(`https://git.softwaregroup.com/api/v4/projects/${encodeURIComponent(projectId)}/statuses/${process.env.GITLAB_OA_LAST_COMMIT_ID || process.env.GIT_COMMIT}`, {
            json: {
                state,
                name: 'UI tests - Chromatic',
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
        try {
            await setStatus('pending');
            const result = spawn(
                process.argv[0],
                [
                    resolve(require.resolve('chromatic/package.json'), '..', require('chromatic/package.json').bin.chromatic),
                    '-d',
                    '.lint/storybook',
                    '--exit-zero-on-changes',
                    '--exit-once-uploaded',
                    ...args
                ], {
                    stdio: ['inherit', 'pipe', 'pipe'],
                    ...process.env.GITLAB_OA_LAST_COMMIT_ID && {
                        env: {
                            ...process.env,
                            CHROMATIC_SHA: process.env.GITLAB_OA_LAST_COMMIT_ID
                        }
                    }
                }
            );
            let details = '';
            let url = '';
            const tryMatch = level => line => {
                const match = line.match(DETAILS);
                if (match) {
                    details = match[0];
                    url = match[1];
                }
                console[level](line);
            };
            result.stdout.pipe(split()).on('data', tryMatch('log'));
            result.stderr.pipe(split()).on('data', tryMatch('error'));
            result.on('exit', async(code, signal) => {
                try {
                    if (!await setStatus(code || signal ? 'failed' : 'running', details, url)) {
                        if (code || signal) process.exit(1);
                    }
                } catch (error) {
                    console.error(error);
                    process.exit(1);
                }
            });
            result.on('error', error => {
                console.error(error);
                process.exit(1);
            });
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    });

program.parse();
