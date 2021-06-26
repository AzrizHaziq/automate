import { test, expect } from '@playwright/test'

test.describe('MITI', () => {
  test.beforeEach(async ({ page: p }) => {
    await p.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await p.goto('https://sahamonline.miti.gov.my/')
  })

  test('Is there any new update?', async ({ page: p }) => {
    const el = await p.$('.makluman')
    expect(await el.screenshot()).toMatchSnapshot('miti.png')
  })

  test('Is there is update on your application', async ({ page: p }) => {
    await p.fill('input.login', ic)
    await p.fill('input.password', pass)
    await p.click('#go')

    await p.click('text=My Saham')

    await p.waitForTimeout(5000)
  })
})
