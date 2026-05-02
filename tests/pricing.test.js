/**
 * Unit Tests for Pricing Service
 * Tests all pricing calculation functions with edge cases and boundary conditions
 */

const {
  calculateTotal,
  calculateDiscount,
  calculateTax,
  calculateFinalPrice
} = require('../services/pricing');

// ============================================================================
// TEST SUITE: PRICING SERVICE
// ============================================================================

describe('Pricing Service', () => {
  
  // ==========================================================================
  // calculateTotal Tests
  // ==========================================================================
  
  describe('calculateTotal', () => {
    describe('Valid Input Cases', () => {
      test('should calculate total for multiple items', () => {
        const items = [
          { price: 10.50, quantity: 2 },
          { price: 25.00, quantity: 1 }
        ];
        expect(calculateTotal(items)).toBe(46);
      });

      test('should handle single item', () => {
        const items = [{ price: 15.99, quantity: 3 }];
        expect(calculateTotal(items)).toBe(47.97);
      });

      test('should handle string prices and quantities', () => {
        const items = [
          { price: '15.50', quantity: '2' },
          { price: '10', quantity: '3' }
        ];
        expect(calculateTotal(items)).toBe(61);
      });

      test('should handle large numbers', () => {
        const items = [{ price: 999999.99, quantity: 100 }];
        expect(calculateTotal(items)).toBe(99999999);
      });
    });

    describe('Edge Cases and Invalid Input', () => {
      test('should return 0 for empty array', () => {
        expect(calculateTotal([])).toBe(0);
      });

      test('should return 0 for null input', () => {
        expect(calculateTotal(null)).toBe(0);
      });

      test('should return 0 for undefined input', () => {
        expect(calculateTotal(undefined)).toBe(0);
      });

      test('should return 0 for non-array input', () => {
        expect(calculateTotal('not an array')).toBe(0);
        expect(calculateTotal(123)).toBe(0);
        expect(calculateTotal({})).toBe(0);
      });
    });

    describe('Default Value Handling', () => {
      test('should handle missing quantity (defaults to 1)', () => {
        const items = [{ price: 20 }];
        expect(calculateTotal(items)).toBe(20);
      });

      test('should handle missing price (defaults to 0)', () => {
        const items = [{ quantity: 5 }];
        expect(calculateTotal(items)).toBe(0);
      });

      test('should handle invalid price values', () => {
        const items = [
          { price: 'invalid', quantity: 2 },
          { price: 10, quantity: 1 }
        ];
        expect(calculateTotal(items)).toBe(10);
      });

      test('should handle invalid quantity values (defaults to 1)', () => {
        const items = [
          { price: 20, quantity: 'invalid' },
          { price: 10, quantity: 2 }
        ];
        expect(calculateTotal(items)).toBe(40);
      });
    });

    describe('Boundary Value Tests', () => {
      test('should handle zero price', () => {
        const items = [{ price: 0, quantity: 5 }];
        expect(calculateTotal(items)).toBe(0);
      });

      test('should handle zero quantity', () => {
        const items = [{ price: 50, quantity: 0 }];
        expect(calculateTotal(items)).toBe(0);
      });

      test('should handle negative prices', () => {
        const items = [{ price: -10, quantity: 2 }];
        expect(calculateTotal(items)).toBe(-20);
      });

      test('should handle decimal quantities (parseInt truncates)', () => {
        const items = [{ price: 10, quantity: 2.5 }];
        expect(calculateTotal(items)).toBe(20);
      });
    });
  });

  // ==========================================================================
  // calculateDiscount Tests
  // ==========================================================================
  
  describe('calculateDiscount', () => {
    describe('Discount Tier: 15% (>= $1000)', () => {
      test('should return 15% discount for orders >= $1000', () => {
        expect(calculateDiscount(1000)).toBe(150);
        expect(calculateDiscount(1500)).toBe(225);
        expect(calculateDiscount(2000)).toBe(300);
      });

      test('should handle very large values', () => {
        expect(calculateDiscount(10000)).toBe(1500);
        expect(calculateDiscount(1000000)).toBe(150000);
      });
    });

    describe('Discount Tier: 10% ($500-$999.99)', () => {
      test('should return 10% discount for orders >= $500 and < $1000', () => {
        expect(calculateDiscount(500)).toBe(50);
        expect(calculateDiscount(750)).toBe(75);
        expect(calculateDiscount(999.99)).toBeCloseTo(99.999);
      });
    });

    describe('Discount Tier: 5% ($100-$499.99)', () => {
      test('should return 5% discount for orders >= $100 and < $500', () => {
        expect(calculateDiscount(100)).toBe(5);
        expect(calculateDiscount(250)).toBeCloseTo(12.5);
        expect(calculateDiscount(499.99)).toBeCloseTo(24.9995);
      });
    });

    describe('No Discount (< $100)', () => {
      test('should return 0 discount for orders < $100', () => {
        expect(calculateDiscount(99.99)).toBe(0);
        expect(calculateDiscount(50)).toBe(0);
        expect(calculateDiscount(0)).toBe(0);
      });

      test('should handle negative values', () => {
        expect(calculateDiscount(-100)).toBe(0);
      });
    });

    describe('Boundary Value Tests', () => {
      test('should handle discount tier boundaries correctly', () => {
        // Just below $100 threshold
        expect(calculateDiscount(99.99)).toBe(0);
        // At $100 threshold
        expect(calculateDiscount(100)).toBe(5);
        // Just below $500 threshold
        expect(calculateDiscount(499.99)).toBeCloseTo(24.9995, 4);
        // At $500 threshold
        expect(calculateDiscount(500)).toBe(50);
        // Just below $1000 threshold
        expect(calculateDiscount(999.99)).toBeCloseTo(99.999, 3);
        // At $1000 threshold
        expect(calculateDiscount(1000)).toBe(150);
      });

      test('should handle decimal values', () => {
        expect(calculateDiscount(1234.56)).toBeCloseTo(185.184, 3);
      });
    });
  });

  // ==========================================================================
  // calculateTax Tests
  // ==========================================================================
  
  describe('calculateTax', () => {
    describe('Default Tax Rate (8%)', () => {
      test('should calculate tax with default rate', () => {
        expect(calculateTax(100)).toBe(8);
        expect(calculateTax(250)).toBe(20);
      });

      test('should handle decimal values', () => {
        expect(calculateTax(123.45)).toBeCloseTo(9.876, 3);
      });
    });

    describe('Custom Tax Rates', () => {
      test('should calculate tax with custom rate', () => {
        expect(calculateTax(100, 0.10)).toBe(10);
        expect(calculateTax(200, 0.05)).toBe(10);
        expect(calculateTax(500, 0.15)).toBe(75);
      });

      test('should handle very small tax rates', () => {
        expect(calculateTax(1000, 0.001)).toBe(1);
      });

      test('should handle very large tax rates', () => {
        expect(calculateTax(100, 1.5)).toBe(150);
      });
    });

    describe('Edge Cases', () => {
      test('should handle zero price', () => {
        expect(calculateTax(0)).toBe(0);
        expect(calculateTax(0, 0.10)).toBe(0);
      });

      test('should handle zero tax rate', () => {
        expect(calculateTax(100, 0)).toBe(0);
      });

      test('should handle negative price', () => {
        expect(calculateTax(-100)).toBe(-8);
      });

      test('should handle negative tax rate', () => {
        expect(calculateTax(100, -0.05)).toBe(-5);
      });
    });
  });

  // ==========================================================================
  // calculateFinalPrice Tests
  // ==========================================================================
  
  describe('calculateFinalPrice', () => {
    describe('Complete Price Calculations', () => {
      test('should calculate final price with all components', () => {
        const items = [
          { price: 100, quantity: 2 },
          { price: 50, quantity: 1 }
        ];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(250);
        expect(result.discount).toBe(12.5); // 5% of 250
        expect(result.priceAfterDiscount).toBe(237.5);
        expect(result.tax).toBeCloseTo(19, 1); // 8% of 237.5
        expect(result.finalPrice).toBeCloseTo(256.5, 1);
      });

      test('should handle complex order with multiple items', () => {
        const items = [
          { price: 299.99, quantity: 2 },
          { price: 149.50, quantity: 3 },
          { price: 75.25, quantity: 1 }
        ];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(1523.73);
        expect(result.discount).toBeCloseTo(228.56, 2); // 15% discount
        expect(result.priceAfterDiscount).toBeCloseTo(1295.17, 2);
        expect(result.tax).toBeCloseTo(103.61, 2);
        expect(result.finalPrice).toBeCloseTo(1398.78, 2);
      });
    });

    describe('Discount Tier Verification', () => {
      test('should apply 15% discount tier correctly', () => {
        const items = [{ price: 1000, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(1000);
        expect(result.discount).toBe(150); // 15% of 1000
        expect(result.priceAfterDiscount).toBe(850);
        expect(result.tax).toBe(68); // 8% of 850
        expect(result.finalPrice).toBe(918);
      });

      test('should apply 10% discount tier correctly', () => {
        const items = [{ price: 500, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(500);
        expect(result.discount).toBe(50); // 10% of 500
        expect(result.priceAfterDiscount).toBe(450);
        expect(result.tax).toBe(36); // 8% of 450
        expect(result.finalPrice).toBe(486);
      });

      test('should apply 5% discount tier correctly', () => {
        const items = [{ price: 100, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(100);
        expect(result.discount).toBe(5); // 5% of 100
        expect(result.priceAfterDiscount).toBe(95);
        expect(result.tax).toBe(7.6); // 8% of 95
        expect(result.finalPrice).toBeCloseTo(102.6);
      });

      test('should handle order with no discount', () => {
        const items = [{ price: 50, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(result.subtotal).toBe(50);
        expect(result.discount).toBe(0);
        expect(result.priceAfterDiscount).toBe(50);
        expect(result.tax).toBe(4); // 8% of 50
        expect(result.finalPrice).toBe(54);
      });
    });

    describe('Custom Tax Rate Handling', () => {
      test('should handle custom tax rate', () => {
        const items = [{ price: 100, quantity: 1 }];
        const result = calculateFinalPrice(items, 0.10);
        
        expect(result.subtotal).toBe(100);
        expect(result.discount).toBe(5); // 5% of 100
        expect(result.priceAfterDiscount).toBe(95);
        expect(result.tax).toBe(9.5); // 10% of 95
        expect(result.finalPrice).toBe(104.5);
      });

      test('should handle zero tax rate', () => {
        const items = [{ price: 100, quantity: 1 }];
        const result = calculateFinalPrice(items, 0);
        
        expect(result.subtotal).toBe(100);
        expect(result.discount).toBe(5);
        expect(result.priceAfterDiscount).toBe(95);
        expect(result.tax).toBe(0);
        expect(result.finalPrice).toBe(95);
      });
    });

    describe('Edge Cases and Invalid Input', () => {
      test('should handle empty items array', () => {
        const result = calculateFinalPrice([]);
        
        expect(result.subtotal).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.priceAfterDiscount).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.finalPrice).toBe(0);
      });

      test('should handle null items', () => {
        const result = calculateFinalPrice(null);
        
        expect(result.subtotal).toBe(0);
        expect(result.discount).toBe(0);
        expect(result.priceAfterDiscount).toBe(0);
        expect(result.tax).toBe(0);
        expect(result.finalPrice).toBe(0);
      });
    });

    describe('Precision and Rounding', () => {
      test('should round all values to 2 decimal places', () => {
        const items = [{ price: 33.333, quantity: 3 }];
        const result = calculateFinalPrice(items);
        
        // All values should have at most 2 decimal places
        expect(result.subtotal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(result.discount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(result.priceAfterDiscount.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(result.tax.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
        expect(result.finalPrice.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      });

      test('should maintain precision through calculation chain', () => {
        const items = [{ price: 123.456, quantity: 7 }];
        const result = calculateFinalPrice(items);
        
        // Verify calculation chain with proper rounding
        const expectedSubtotal = 864.19; // Rounded from 864.192
        const expectedDiscount = 129.63; // 15% of 864.19
        const expectedAfterDiscount = 734.56;
        const expectedTax = 58.76; // 8% of 734.56
        const expectedFinal = 793.32;
        
        expect(result.subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(result.discount).toBeCloseTo(expectedDiscount, 2);
        expect(result.priceAfterDiscount).toBeCloseTo(expectedAfterDiscount, 2);
        expect(result.tax).toBeCloseTo(expectedTax, 2);
        expect(result.finalPrice).toBeCloseTo(expectedFinal, 2);
      });
    });

    describe('Return Object Structure', () => {
      test('should return object with correct structure', () => {
        const items = [{ price: 100, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(result).toHaveProperty('subtotal');
        expect(result).toHaveProperty('discount');
        expect(result).toHaveProperty('priceAfterDiscount');
        expect(result).toHaveProperty('tax');
        expect(result).toHaveProperty('finalPrice');
        expect(Object.keys(result).length).toBe(5);
      });

      test('should return all numeric values', () => {
        const items = [{ price: 100, quantity: 1 }];
        const result = calculateFinalPrice(items);
        
        expect(typeof result.subtotal).toBe('number');
        expect(typeof result.discount).toBe('number');
        expect(typeof result.priceAfterDiscount).toBe('number');
        expect(typeof result.tax).toBe('number');
        expect(typeof result.finalPrice).toBe('number');
      });
    });

    describe('Discount Boundary Tests', () => {
      test('should handle all discount tier boundaries', () => {
        // Test at $99.99 (no discount)
        let items = [{ price: 99.99, quantity: 1 }];
        let result = calculateFinalPrice(items);
        expect(result.discount).toBe(0);
        
        // Test at $100 (5% discount)
        items = [{ price: 100, quantity: 1 }];
        result = calculateFinalPrice(items);
        expect(result.discount).toBe(5);
        
        // Test at $500 (10% discount)
        items = [{ price: 500, quantity: 1 }];
        result = calculateFinalPrice(items);
        expect(result.discount).toBe(50);
        
        // Test at $1000 (15% discount)
        items = [{ price: 1000, quantity: 1 }];
        result = calculateFinalPrice(items);
        expect(result.discount).toBe(150);
      });
    });
  });

  // ==========================================================================
  // Integration Tests
  // ==========================================================================
  
  describe('Integration Tests', () => {
    test('should handle complete order flow with all functions', () => {
      const items = [
        { price: 25.99, quantity: 4 },
        { price: 15.50, quantity: 2 },
        { price: 8.75, quantity: 5 }
      ];
      
      // Test individual functions
      const total = calculateTotal(items);
      expect(total).toBeCloseTo(178.71, 2);
      
      const discount = calculateDiscount(total);
      expect(discount).toBeCloseTo(8.94, 2); // 5% discount
      
      const priceAfterDiscount = total - discount;
      const tax = calculateTax(priceAfterDiscount);
      expect(tax).toBeCloseTo(13.58, 2);
      
      // Test integrated function
      const finalPrice = calculateFinalPrice(items);
      expect(finalPrice.finalPrice).toBeCloseTo(183.35, 2);
    });

    test('should maintain consistency across all calculation methods', () => {
      const items = [{ price: 200, quantity: 3 }];
      
      // Calculate using individual functions
      const manualSubtotal = calculateTotal(items);
      const manualDiscount = calculateDiscount(manualSubtotal);
      const manualAfterDiscount = manualSubtotal - manualDiscount;
      const manualTax = calculateTax(manualAfterDiscount);
      const manualFinal = manualAfterDiscount + manualTax;
      
      // Calculate using integrated function
      const result = calculateFinalPrice(items);
      
      // Verify consistency
      expect(result.subtotal).toBeCloseTo(manualSubtotal, 2);
      expect(result.discount).toBeCloseTo(manualDiscount, 2);
      expect(result.priceAfterDiscount).toBeCloseTo(manualAfterDiscount, 2);
      expect(result.tax).toBeCloseTo(manualTax, 2);
      expect(result.finalPrice).toBeCloseTo(manualFinal, 2);
    });

    test('should handle edge case with multiple discount tiers in single test', () => {
      // Test progression through discount tiers
      const testCases = [
        { amount: 50, expectedDiscount: 0 },
        { amount: 150, expectedDiscount: 7.5 },
        { amount: 600, expectedDiscount: 60 },
        { amount: 1200, expectedDiscount: 180 }
      ];
      
      testCases.forEach(({ amount, expectedDiscount }) => {
        const items = [{ price: amount, quantity: 1 }];
        const result = calculateFinalPrice(items);
        expect(result.discount).toBeCloseTo(expectedDiscount, 2);
      });
    });
  });
});

// Made with Bob
