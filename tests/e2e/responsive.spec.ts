import { expect, test } from '@playwright/test'

test.describe('Responsive Design', () => {
  test('homepage should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Main content should be visible
    const mainContent = page.locator('h1')
    await expect(mainContent.first()).toBeVisible()
    
    // Header should be visible
    const header = page.locator('header')
    await expect(header).toBeVisible()
  })

  test('homepage should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // Main content should be visible
    const mainContent = page.locator('h1')
    await expect(mainContent.first()).toBeVisible()
  })

  test('homepage should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    // Main content should be visible
    const mainContent = page.locator('h1')
    await expect(mainContent.first()).toBeVisible()
    
    // Navigation should show all links
    const navLinks = page.locator('header a, header button')
    await expect(navLinks.first()).toBeVisible()
  })

  test('login page should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/auth/login')
    
    // Form should be visible and usable
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('register page should work on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/auth/register')
    
    // Form should be visible
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
  })
})
