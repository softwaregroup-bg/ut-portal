import {
    TestType,
    PlaywrightTestArgs,
    PlaywrightTestOptions,
    Page,
    PlaywrightWorkerArgs,
    PlaywrightWorkerOptions
} from '@playwright/test';
import def from '@playwright/test';

export * from '@playwright/test';
export default def;
export const test: TestType<PlaywrightTestArgs & PlaywrightTestOptions & { portal: Page }, PlaywrightWorkerArgs & PlaywrightWorkerOptions>
