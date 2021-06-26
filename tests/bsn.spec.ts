import { test, expect } from '@playwright/test'

const ics: string[] = (process.env.ICS || '').split(', ')

test.describe('Check BSN SSP with my ic', () => {
  test.beforeEach(async ({ page: p }) => {
    test.skip()

    await p.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await p.goto('https://www.bsn.com.my/page/bsn-ssp-draw-results?lang=ms-MY')
    await p.$('#ssp-search').then(i => i.scrollIntoViewIfNeeded())
  })

  ics.forEach(ic => {
    test(`Test with`, async ({ page: p }) => {
      await p.screenshot({ path: 'load.png' })
      await p.waitForSelector('#ssp-search')
      await p.fill('#ssp-search .bsn-custom-input', ic)
      await p.evaluate(body => body.focus(), await p.$('body'))

      await p.click('#ssp-search button', { force: true })
      // await p.dispatchEvent('#ssp-search button', 'click')

      await p.waitForSelector('.ssp-winner-inner h3')
      const result = await p.$eval('.ssp-winner-inner h3', i => i.textContent)

      expect(result).toBe('Tiada hasil padanan.')
    })
  })
})
