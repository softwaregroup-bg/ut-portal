import {
    TestType,
    PlaywrightTestArgs,
    PlaywrightTestOptions,
    Page,
    PlaywrightWorkerArgs,
    PlaywrightWorkerOptions
} from '@playwright/test';

export * from '@playwright/test';
export const test: TestType<PlaywrightTestArgs & PlaywrightTestOptions & { portal: Page }, PlaywrightWorkerArgs & PlaywrightWorkerOptions>
