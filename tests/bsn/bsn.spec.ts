import { test, expect } from '@playwright/test'

const ics: string[] = process.env.ICS.split(', ')
ics.length = 1

test.describe('Check BSN SSP with my ic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.bsn.com.my/page/bsn-ssp-draw-results?lang=ms-MY', { waitUntil: 'networkidle' })

    await page.$('#ssp-search').then(i => i.scrollIntoViewIfNeeded())
  })

  ics.forEach(ic => {
    test(`Test with`, async ({ page }) => {
      await page.screenshot({ path: 'screenshot.png' })

      await page.waitForSelector('#ssp-search')
      await page.fill('#ssp-search .bsn-custom-input', ic)
      await page.evaluate(body => body.focus(), await page.$('body'))

      await page.screenshot({ path: 'screenshot1.png' })

      await page.click('#ssp-search button', { force: true })
      await page.dispatchEvent('#ssp-search button', 'click')

      await page.waitForTimeout(2000)
      await page.screenshot({ path: 'screenshot3.png' })
      // await page.waitForSelector('.ssp-winner-inner h3')
      // const result = await page.$eval('.ssp-winner-inner h3', i => i.textContent)

      // expect(result).toBe('Tiada hasil padanan.')
    })
  })
})

// test('youtube', async ({ page }) => {
//   await page.goto('https://youtube.com', { waitUntil: 'networkidle' })
//
//   for (let i = 2; i <= 4; i++) {
//     await page.click(`yt-chip-cloud-chip-renderer:nth-child(${i})`, { force: true })
//     await page.waitForTimeout(2000)
//     await page.screenshot({ path: `youtube_${i}.png` })
//   }
// })
