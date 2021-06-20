import { test, expect } from '@playwright/test'

const ics: string[] = process.env.ICS.split(', ')

test.describe('Check BSN SSP with my ic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.bsn.com.my/page/bsn-ssp-draw-results?lang=ms-MY')

    await page.$('#ssp-search').then(i => i.scrollIntoViewIfNeeded())
  })

  ics.forEach(ic => {
    test(`Test with ${ic}`, async ({ page }) => {
      await page.fill('#ssp-search .bsn-custom-input', ic)
      await page.evaluate(body => body.focus(), await page.$('body'))
      await page.dispatchEvent('#ssp-search button', 'click')

      await page.waitForSelector('.ssp-winner-inner h3')
      const result = await page.$eval('.ssp-winner-inner h3', i => i.textContent)

      expect(result).toBe('Tiada hasil padanan.')
    })
  })
})
