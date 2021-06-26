import { test, expect } from '@playwright/test'

test.describe('MITI', () => {
  test.beforeEach(async ({ page: p }) => {
    await p.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await p.goto('https://sahamonline.miti.gov.my/')
  })

  test('is there any new update?', async ({ page: p }) => {
    const el = await p.$('.makluman')
    expect(await el.screenshot()).toMatchSnapshot('miti.png')
  })
})
