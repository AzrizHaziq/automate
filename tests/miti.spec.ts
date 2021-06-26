import { test, expect } from '@playwright/test'

const ic = (process.env.ICS || '').split(', ')[0]
const long_password = process.env.MITI_PASS

//  minify => remove whitespace,
// uglify =>  tukar var, short

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

    const el = await p.$('table')

    await p.evaluate(() => {
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

    expect(await el.screenshot()).toMatchSnapshot('status_miti.png')
  })
})
