import { expect, test } from '@playwright/test'

test.describe('Workflows List Page', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/workflows')
    
    // Should redirect to login
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/auth/login')
  })

  test('login page should work after workflows redirect', async ({ page }) => {
    await page.goto('/workflows')
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
    
    // Form should be visible
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })
})
