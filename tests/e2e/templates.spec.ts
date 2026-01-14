import { expect, test } from '@playwright/test'

test.describe('Workflow Templates', () => {
  test('editor should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/workflows/editor')
    
    // Should redirect to login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/auth/login')
  })

  test('login page should be accessible from editor redirect', async ({ page }) => {
    await page.goto('/workflows/editor')
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
    
    // Login form should be visible
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })
})
