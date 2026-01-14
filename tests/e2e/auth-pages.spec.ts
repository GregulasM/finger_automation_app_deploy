import { expect, test } from '@playwright/test'

test.describe('Authentication Pages', () => {
  test('login page should have email and password fields', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check for email input
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible()
    
    // Check for password input
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('register page should have all required fields', async ({ page }) => {
    await page.goto('/auth/register')
    
    // Check for inputs - name, email, password
    const inputs = page.locator('input')
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(3)
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('login page should have link to register', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Look for "Create one" register link in main content
    const registerLink = page.getByRole('main').getByRole('link', { name: /create|создать/i })
    await expect(registerLink).toBeVisible()
  })

  test('register page should have link to login', async ({ page }) => {
    await page.goto('/auth/register')
    
    // Look for login link in main content area
    const loginLink = page.getByRole('main').getByRole('link', { name: /sign in|войти/i })
    await expect(loginLink).toBeVisible()
  })

  test('login form validation should prevent empty submit', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Should stay on login page (HTML5 validation)
    expect(page.url()).toContain('/auth/login')
  })
})
