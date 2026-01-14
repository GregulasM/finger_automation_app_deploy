import { expect, test } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage with correct elements', async ({ page }) => {
    await page.goto('/')
    
    // Check main heading
    await expect(page.locator('h1')).toBeVisible()
    
    // Check feature badges are present
    const badges = page.locator('.rounded-full')
    await expect(badges.first()).toBeVisible()
    
    // Check navigation links in header
    await expect(page.getByRole('banner').getByRole('link', { name: /home|главная/i })).toBeVisible()
    await expect(page.getByRole('banner').getByRole('link', { name: /workflows|воркфлоу/i })).toBeVisible()
  })

  test('should have "New workflow" button in main area', async ({ page }) => {
    await page.goto('/')
    
    // Find the "New workflow" button in main content area (not header)
    const newWorkflowLink = page.getByRole('main').getByRole('link', { name: /new workflow|новый воркфлоу/i })
    await expect(newWorkflowLink).toBeVisible()
  })

  test('should have dark theme background', async ({ page }) => {
    await page.goto('/')
    
    // Check that the page has dark background
    const mainDiv = page.locator('div.bg-zinc-950').first()
    await expect(mainDiv).toBeVisible()
  })

  test('should have sign in link', async ({ page }) => {
    await page.goto('/')
    
    // Find sign in link
    const signInLink = page.getByRole('banner').getByRole('link', { name: /sign in|войти/i })
    await expect(signInLink).toBeVisible()
  })
})
