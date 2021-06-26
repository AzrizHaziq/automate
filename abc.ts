import fs from 'fs'
// import { chromium as puppeteer } from 'playwright-chromium'
import puppeteer from 'puppeteer'
// import puppeteer from 'puppeteer-extra'
// import StealthPlugin from 'puppeteer-extra-plugin-stealth'

// puppeteer.use(StealthPlugin())

async function scrapBursaMalaysia() {
  const scrapUrl = ({ per_page, page }) =>
    `https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=${page}&per_page=${per_page}`

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--start-maximized', '--disable-blink-features=AutomationControlled', ' --incognito'],
      headless: false,
    })

    const page = await browser.newPage()
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.4472.114 Safari/537.36'
    )

    await page.goto(scrapUrl({ page: 1, per_page: 50 }))

    await page.screenshot({ path: `page-${'1'}.png` })

    // getting max size of syariah list by grabbing the value in pagination btn
    const maxPageNumbers = await page.evaluate(() => {
      // document.querySelector('.pagination li [data-val]').scrollIntoView()
      const paginationBtn = Array.from(document.querySelectorAll('.pagination li [data-val]'))
        .map(i => i.textContent)
        .filter(Boolean)
        .map(parseFloat)

      return Math.max(...paginationBtn)
    })

    let syariahList = {}

    // grab all syariah list and navigate to each pages.
    for (let i = 1; i <= maxPageNumbers; i++) {
      await page.goto(scrapUrl({ page: i, per_page: 50 }), { waitUntil: 'networkidle0' })

      const temp = await page.evaluate(() => {
        const pipe =
          (...fn) =>
          initialVal =>
            fn.reduce((acc, fn) => fn(acc), initialVal)
        const removeSpaces = pipe(name => name.replace(/\s/gm, ''))
        const removeSpacesAndShariah = pipe(removeSpaces, name => name.replace(/\[S\]/gim, ''))

        // document.querySelector('.dataTables_scrollBody table tbody tr').scrollIntoView()

        return Array.from(document.querySelectorAll('.dataTables_scrollBody table tbody tr')).reduce((acc, tr) => {
          const s = tr.querySelector(':nth-child(2)').textContent
          const stockCode = tr.querySelector(':nth-child(3)').textContent

          const code = removeSpaces(stockCode)
          const stockName = removeSpacesAndShariah(s)
          return {
            ...acc,
            [code]: {
              s: 1,
              code,
              stockName,
            },
          }
        }, {})
      })

      syariahList = { ...syariahList, ...temp }
    }

    await browser.close()

    console.log('\n\nFound: ', Object.keys(syariahList).length)

    return syariahList
  } catch (e) {
    console.error('Error scrap data', e)
    process.exit(1)
  }
}

scrapBursaMalaysia().then(j => {
  fs.writeFileSync('abc.json', JSON.stringify(j, null, 2))
})

// async function abc() {
//   const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
//   const page = await browser.newPage()
//
//   const urls = [
//     { url: 'https://www.bsn.com.my/page/bsn-ssp-draw-results?lang=ms-MY', path: 'bsn.png' },
//     { url: 'https://www.sc.com.my/resources/prospectus-exposure', path: 'sc.png' },
//     { url: 'https://sahamonline.miti.gov.my/', path: 'miti.png' },
//     { url: 'https://www.youtube.com/', path: 'youtube.png' },
//     {
//       url: 'https://www.bursamalaysia.com/market_information/equities_prices?legend[]=[S]&sort_by=short_name&sort_dir=asc&page=2&per_page=50',
//       path: 'bm.png',
//     },
//   ]
//
//   for (const { url, path } of urls) {
//     await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
//     )
//
//     await page.goto(url, { waitUntil: 'networkidle0' })
//     await page.screenshot({ path: `./ss/pw/${path}` })
//   }
//
//   await browser.close()
// }
//
// abc()

// function* generateUserAgent() {
//   let webkitVersion = 10
//   let chromeVersion = 1000
//
//   const so = [
//     'Windows NT 6.1; WOW64',
//     'Windows NT 6.2; Win64; x64',
//     'Windows NT 5.1; Win64; x64',
//     'Macintosh; Intel Mac OS X 10_12_6',
//     'X11; Linux x86_64',
//     'X11; Linux armv7l',
//   ]
//   let soIndex = Math.floor(Math.random() * so.length)
//
//   while (true) {
//     yield `Mozilla/5.0 (${
//       so[soIndex++ % so.length]
//     }) AppleWebKit/537.${webkitVersion} (KHTML, like Gecko) Chrome/56.0.${chromeVersion}.87 Safari/537.${webkitVersion} OPR/43.0.2442.991`
//
//     webkitVersion++
//     chromeVersion++
//   }
// }
//
// const userAgents = generateUserAgent()
//
// // ...
// await page.setUserAgent(userAgents.next().value)
