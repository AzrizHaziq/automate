// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test'

const isDev = process.env.NODE_ENV === 'development'

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  // retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 2 : 5,
  use: {
    slowMo: 50,
    headless: !isDev,
    launchOptions: {
      // devtools: true,
    },
  },
}
export default config
