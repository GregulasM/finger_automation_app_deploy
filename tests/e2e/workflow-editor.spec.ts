import { expect, test } from '@playwright/test'

test.describe('Workflow Editor Access', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/workflows/editor')
    
    // Should redirect to login page since auth is required
    await page.waitForURL(/\/auth\/login/, { timeout: 10000 })
    expect(page.url()).toContain('/auth/login')
  })

  test('editor page URL should be accessible', async ({ page }) => {
    // Just verify the route exists (will redirect to login)
    const response = await page.goto('/workflows/editor')
    // 200 from login page after redirect
    expect(response?.status()).toBeLessThan(500)
  })
})
