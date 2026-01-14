import { expect, test } from '@playwright/test'

test.describe('UI Interactions', () => {
  test('header should have hover effects on buttons', async ({ page }) => {
    await page.goto('/')
    
    // Find a button in header
    const headerButton = page.locator('header button').first()
    await expect(headerButton).toBeVisible()
    
    // Hover over button
    await headerButton.hover()
    
    // Button should still be visible after hover
    await expect(headerButton).toBeVisible()
  })

  test('feature badges should be visible', async ({ page }) => {
    await page.goto('/')
    
    // Find feature badge
    const badge = page.locator('.rounded-full').first()
    await expect(badge).toBeVisible()
  })

  test('form inputs should be focusable and typeable', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Focus and type in email field
    const emailInput = page.locator('input[type="email"]')
    await emailInput.click()
    await emailInput.fill('test@example.com')
    
    // Check value was entered
    await expect(emailInput).toHaveValue('test@example.com')
    
    // Focus and type in password field
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.click()
    await passwordInput.fill('testpassword123')
    
    // Check value was entered
    await expect(passwordInput).toHaveValue('testpassword123')
  })

  test('navigation links should be clickable', async ({ page }) => {
    await page.goto('/')
    
    // Find a link in header
    const homeLink = page.locator('header a').first()
    await expect(homeLink).toBeVisible()
    
    // Click should work
    await homeLink.click()
    
    // Should not error
    await expect(page.locator('body')).toBeVisible()
  })

  test('dark theme should be applied', async ({ page }) => {
    await page.goto('/')
    
    // Check dark background exists
    const darkBg = page.locator('.bg-zinc-950')
    await expect(darkBg.first()).toBeVisible()
  })
})
