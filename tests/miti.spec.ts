import { test, expect } from '@playwright/test'

const ic = (process.env.ICS || '').split(', ')[0]
const pass = process.env.MITI_PASS

test.describe('MITI', () => {
  test.beforeEach(async ({ page: p }, testInfo) => {
    testInfo.snapshotSuffix = ''
    await p.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
    await p.goto('https://sahamonline.miti.gov.my/')
  })

  test('Is there any new update?', async ({ page: p }) => {
    const el = await p.$('.makluman')
    expect(await el.textContent()).toMatchSnapshot('miti.txt', { threshold: 0.9 })
  })

  test.only('Is there is update on your application', async ({ page: p }) => {
    await p.fill('input.login', ic)
    await p.fill('input.password', pass)
    await p.click('#go')
    await p.click('text=My Saham')

    await p.screenshot({ path: 'abc.png' })

    await p.evaluate(() => {
      document.querySelectorAll('.tooltip').forEach((e: HTMLElement) => (e.style.display = 'none'))

      const leaveColsTo = 3
      const tableEl = document.querySelector('table')

      Array.from(tableEl.rows).forEach(row => {
        const maxCols = row.children.length

        for (let i = 0; i <= maxCols; i++) {
          if (row.cells[leaveColsTo]) {
            row.cells[leaveColsTo].remove()
          }
        }
      })
    })

    await p.waitForTimeout(2000)
    const el = await p.$('table')
    expect(await el.textContent()).toMatchSnapshot('miti_status.txt', { threshold: 0.9 })
  })
})
