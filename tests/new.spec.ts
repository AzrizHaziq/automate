import { test, expect } from '@playwright/test'

test.describe('test', () => {
  test.only('expect error to throw', async () => {
    expect(1).toBe(2)
  })
})
0
