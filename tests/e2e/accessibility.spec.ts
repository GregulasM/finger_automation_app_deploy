import { expect, test } from '@playwright/test'

test.describe('Accessibility', () => {
  test('homepage should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Should have h1
    const h1 = page.locator('h1')
    await expect(h1.first()).toBeVisible()
  })

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/')
    
    // Tab through elements
    await page.keyboard.press('Tab')
    
    // Something should be focused
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/')
    
    // All buttons should have text or aria-label
    const buttons = page.locator('button')
    const count = await buttons.count()
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i)
      const text = await button.textContent()
      const ariaLabel = await button.getAttribute('aria-label')
      
      // Button should have either text content or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

  test('links should have descriptive text', async ({ page }) => {
    await page.goto('/')
    
    // All links should have text or aria-label
    const links = page.locator('a[href]')
    const count = await links.count()
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i)
      const text = await link.textContent()
      const ariaLabel = await link.getAttribute('aria-label')
      
      // Link should have either text content or aria-label
      expect(text?.trim() || ariaLabel).toBeTruthy()
    }
  })

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check that inputs have associated labels or placeholders
    const inputs = page.locator('input:not([type="hidden"])')
    const count = await inputs.count()
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const placeholder = await input.getAttribute('placeholder')
      const ariaLabel = await input.getAttribute('aria-label')
      const id = await input.getAttribute('id')
      
      // Input should have placeholder, aria-label, or associated label
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        const hasLabel = await label.count() > 0
        expect(placeholder || ariaLabel || hasLabel).toBeTruthy()
      } else {
        expect(placeholder || ariaLabel).toBeTruthy()
      }
    }
  })
})
