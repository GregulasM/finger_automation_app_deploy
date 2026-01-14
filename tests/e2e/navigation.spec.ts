import { expect, test } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Find sign in link in header
    const signInLink = page.getByRole('banner').getByRole('link', { name: /sign in|войти/i })
    await expect(signInLink).toBeVisible()
    await signInLink.click()
    
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })

  test('should navigate back to home from login', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click on Home link in header
    const homeLink = page.getByRole('banner').getByRole('link', { name: /home|главная/i })
    await expect(homeLink).toBeVisible()
    await homeLink.click()
    
    await page.waitForURL(/^http:\/\/localhost:\d+\/?$/)
  })

  test('should have working brand logo link', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click on brand/logo (first link in header)
    const brandLink = page.locator('header a').first()
    await expect(brandLink).toBeVisible()
    await brandLink.click()
    
    await page.waitForURL(/^http:\/\/localhost:\d+\/?$/)
  })

  test('workflows link should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/')
    
    // Click on Workflows link
    const workflowsLink = page.getByRole('banner').getByRole('link', { name: /workflows|воркфлоу/i })
    await expect(workflowsLink).toBeVisible()
    await workflowsLink.click()
    
    // Should redirect to login
    await page.waitForURL(/\/auth\/login/)
    expect(page.url()).toContain('/auth/login')
  })
})
