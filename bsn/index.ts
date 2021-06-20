import { chromium } from 'playwright-chromium'

const isDev = process.env.NODE_ENV === 'development'
const ics: string[] = process.env.ICS.split(', ')

;(async () => {
  const browser = await chromium.launch({ headless: !isDev })
  const context = await browser.newContext()

  async function checkIC(ic: string): Promise<string> {
    const page = await context.newPage()

    await page.goto('https://www.bsn.com.my/page/bsn-ssp-draw-results?lang=ms-MY')

    // enter ic
    await page.$('#ssp-search').then(i => i.scrollIntoViewIfNeeded())

    await page.fill('#ssp-search .bsn-custom-input', ic)
    await page.press('#ssp-search .bsn-custom-input', 'Enter')

    await page.waitForSelector('.ssp-winner-inner h3')
    return await page.$eval('.ssp-winner-inner h3', i => i.textContent)
  }

  const responses = await Promise.all(ics.map(checkIC))
  const { size } = new Set(responses)
  await browser.close()

  if (size > 1) {
    console.log('\x1b[32m', 'Please check on BSN page')
    process.exit(1)
  }

  console.log('\x1b[31m', 'Sad, still "Tiada padanan"')
})()
