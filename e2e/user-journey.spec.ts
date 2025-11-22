import { test, expect } from '@playwright/test';

/**
 * Complete User Journey Test
 * 
 * This test validates the entire user flow from registration to cart persistence:
 * 1. User registration with form validation
 * 2. Product browsing and adding items to cart
 * 3. Cart management (add, remove items)
 * 4. Logout and login with validation
 * 5. Cart persistence after login
 */
test.describe('Complete User Journey', () => {
  test('should complete full flow: register -> browse products -> add items -> manage cart -> logout -> login', async ({ page }) => {
    // Generate unique email using timestamp to avoid conflicts with existing users
    const uniqueEmail = `testuser${Date.now()}@example.com`;
    const password = 'Test123';

    /**
     * Helper function: Find and add the first available in-stock product to cart
     * 
     * This function:
     * - Iterates through all product cards
     * - Finds the first product that is "In Stock" and has an enabled add button
     * - Clicks the add button and waits for success notification
     * - Returns the product title and price for later verification
     * - Returns null if no in-stock products are found
     */
    const addInStockProduct = async () => {
      const cards = page.locator('.product-card');
      const count = await cards.count();
      
      // Loop through all product cards to find an in-stock item
      for (let i = 0; i < count; i++) {
        const card = cards.nth(i);
        const stockStatus = await card.locator('.product-stock').textContent();
        const btn = card.locator('.add-to-cart-btn');
        
        // Check if product is in stock and button is enabled
        if (stockStatus?.includes('In Stock') && !(await btn.isDisabled())) {
          // Extract product details for verification
          const title = (await card.locator('.product-title').textContent()) || '';
          const price = parseFloat((await card.locator('.product-price').textContent())?.replace('$', '') || '0');
          
          // Add product to cart
          await btn.click();
          
          // Verify success notification appears
          await expect(page.locator('.notification-toast.success')).toBeVisible({ timeout: 3000 });
          
          return { title, price };
        }
      }
      return null;
    };

    // ========== REGISTRATION WITH VALIDATION ==========
    // Navigate to registration page
    await page.goto('/register');
    
    // Verify Register button is initially disabled (form is invalid)
    await expect(page.getByRole('button', { name: 'Register' })).toBeDisabled();
    
    // Test email validation: invalid email format
    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
    await page.getByRole('textbox', { name: 'Email' }).blur(); // Trigger validation
    await expect(page.locator('.form-group:has(#email) .error-message')).toContainText(/valid email/i);
    
    // Test password validation: missing capital letter
    await page.getByRole('textbox', { name: 'Email' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('test123');
    await page.getByRole('textbox', { name: 'Password', exact: true }).blur();
    await expect(page.locator('.form-group:has(#password) .error-message')).toContainText(/capital letter/i);
    
    // Test password confirmation validation: passwords don't match
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill(password);
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Different123');
    await page.getByRole('textbox', { name: 'Confirm Password' }).blur();
    await expect(page.locator('.form-group:has(#confirmPassword) .error-message')).toContainText(/do not match/i);
    
    // Fill all fields correctly and submit registration
    await page.getByRole('textbox', { name: 'Confirm Password' }).fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    
    // Verify successful registration redirects to products page
    await page.waitForURL('/products', { timeout: 5000 });

    // ========== PRODUCT BROWSING & ADD TO CART ==========
    // Wait for products to load
    await page.waitForSelector('.product-card', { timeout: 10000 });
    
    // Add first in-stock product to cart
    const firstProduct = await addInStockProduct();
    if (!firstProduct) {
      throw new Error('No products in stock - cannot complete test');
    }

    // Verify product card displays all required elements:
    // - Product title
    // - Product price
    // - Stock status
    // - Product image
    await expect(page.locator('.product-card').first().locator('.product-title, .product-price, .product-stock, .product-image')).toHaveCount(4);
    
    // Verify that out-of-stock products have disabled add-to-cart buttons
    // (This ensures the UI correctly prevents adding unavailable items)
    const outOfStockCard = page.locator('.product-card').filter({ hasText: 'Out of Stock' }).first();
    if (await outOfStockCard.count() > 0) {
      await expect(outOfStockCard.locator('.add-to-cart-btn')).toBeDisabled();
    }

    // ========== CART VERIFICATION ==========
    // Navigate to cart page
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.waitForURL('/cart', { timeout: 5000 });
    
    // Verify cart contains exactly one item
    await expect(page.locator('.cart-item')).toHaveCount(1);
    
    // Verify the correct product is in the cart
    await expect(page.locator('.cart-item-title')).toContainText(firstProduct!.title);
    
    // Verify cart total matches the product price
    const total = parseFloat((await page.locator('.total-amount').textContent())?.replace('$', '') || '0');
    expect(total).toBeCloseTo(firstProduct!.price, 2);

    // ========== ADD SECOND PRODUCT & VERIFY MULTIPLE ITEMS ==========
    // Navigate back to products page
    await page.getByRole('link', { name: 'Products' }).click();
    await page.waitForURL('/products', { timeout: 5000 });
    
    // Add a second product (if available and different from first)
    const secondProduct = await addInStockProduct();
    
    // Navigate to cart to verify multiple items
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.waitForURL('/cart', { timeout: 5000 });
    
    // If a different second product was added, verify cart has 2 items and total is correct
    if (secondProduct && secondProduct.title !== firstProduct!.title) {
      await expect(page.locator('.cart-item')).toHaveCount(2);
      const finalTotal = parseFloat((await page.locator('.total-amount').textContent())?.replace('$', '') || '0');
      expect(finalTotal).toBeCloseTo(firstProduct!.price + secondProduct.price, 2);
    } else {
      // If same product or no second product, cart should still have 1 item
      await expect(page.locator('.cart-item')).toHaveCount(1);
    }

    // ========== REMOVE ITEMS (but keep one for persistence test) ==========
    // Remove items but keep at least one product in cart for persistence testing
    // This ensures we can verify that the cart persists after logout/login
    if (secondProduct && secondProduct.title !== firstProduct!.title) {
      // Remove the second product, keep the first one
      await page.getByRole('button', { name: 'Remove' }).last().click();
      await page.waitForTimeout(500); // Wait for removal animation/state update
      
      // Verify only one item remains
      await expect(page.locator('.cart-item')).toHaveCount(1);
      await expect(page.locator('.cart-item-title')).toContainText(firstProduct!.title);
    }
    
    // Store reference to the product that should persist after login
    const persistenceProduct = firstProduct;
    
    // Verify cart has the product before logout (baseline for persistence test)
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-item-title')).toContainText(persistenceProduct.title);

    // ========== LOGOUT & LOGIN WITH VALIDATION ==========
    // Logout to test login flow and cart persistence
    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('/login', { timeout: 5000 });
    
    // Fill email field - clear first to ensure clean state
    // (Angular forms may retain state, so clearing ensures fresh validation)
    const emailInput = page.locator('#email');
    await emailInput.clear();
    await emailInput.fill(uniqueEmail);
    
    // Verify email was filled correctly
    await expect(emailInput).toHaveValue(uniqueEmail);
    await emailInput.blur(); // Trigger Angular validation
    
    // Wait for email validation error to clear (form should be valid)
    // Note: We don't use .catch() here - we actually want to wait for validation
    await expect(page.locator('.form-group:has(#email) .error-message')).not.toBeVisible({ timeout: 5000 });
    
    // Fill password field with wrong password to test error handling
    const passwordInput = page.locator('#password');
    await passwordInput.fill('WrongPassword123');
    await expect(passwordInput).toHaveValue('WrongPassword123');
    await passwordInput.blur();
    
    // Wait for password validation to complete
    await expect(page.locator('.form-group:has(#password) .error-message')).not.toBeVisible({ timeout: 5000 });
    
    // Wait for Angular change detection and form validation to complete
    await page.waitForTimeout(200);
    
    // Wait for Login button to be enabled (form should be valid now)
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 10000 });
    
    // Attempt login with wrong password
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify server error message appears for incorrect password
    await expect(page.locator('.error-message.server-error')).toContainText(/login failed|invalid|incorrect|wrong/i);
    
    // Fill password with correct value
    await passwordInput.fill(password);
    await passwordInput.blur();
    
    // Wait for Angular change detection and form validation
    await page.waitForTimeout(300);
    
    // Wait for Login button to be enabled again
    await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled({ timeout: 10000 });
    
    // Login with correct credentials
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login redirects to products page
    await page.waitForURL('/products', { timeout: 5000 });

    // ========== VERIFY CART PERSISTENCE ==========
    // Navigate to cart to verify that items persisted after logout/login
    // This is a critical feature: cart should be saved per user and restored on login
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.waitForURL('/cart', { timeout: 5000 });
    
    // Verify cart still contains the product that was added before logout
    await expect(page.locator('.cart-item')).toHaveCount(1);
    await expect(page.locator('.cart-item-title')).toContainText(persistenceProduct.title);
  });
});
