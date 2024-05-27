import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

//remove all comments and no needed variables
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
  require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  //timeout: 10000 -- for test wait for 10 sec,
  //globalTimeout: 60000 --
  expect:{
    timeout:2000,
    toHaveScreenshot: {maxDiffPixels:150} //if there are unstable ui and no precise images
  }, //set the locator timeout
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true, //test inside spec  are working in parallel
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0, //CI retries 2 times, in local machine 0
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined, //1 worker by spec file
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html'],
    // ['junit', {outputFile: 'test-results/junitreport.xml'}],
    // ['allure-playwright']
  ], //list, json
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
    //     :process.env.STAGING === '1' ? 'http://localhost:4201/'
    //     :'http://localhost:4201/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //actionTimeout:
    //navigationTimeout:
    video: {
      mode: 'on',
      size: {width:1920, height:1080}
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
      fullyParallel:true
    },
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200/'
       },
      fullyParallel:true
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      fullyParallel:true
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
    timeout: 120 * 1000
  }
});
