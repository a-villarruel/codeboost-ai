/**
 * Pricing Service
 * Handles all pricing calculations for orders including discounts, taxes, and final totals
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const DISCOUNT_TIERS = [
  { threshold: 1000, rate: 0.15 },
  { threshold: 500, rate: 0.10 },
  { threshold: 100, rate: 0.05 }
];

const DEFAULT_TAX_RATE = 0.08;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely parse and validate numeric values
 * @private
 */
const parseNumeric = {
  price: (value) => parseFloat(value) || 0,
  quantity: (value) => parseInt(value) || 1,
  round: (value) => parseFloat(value.toFixed(2))
};

/**
 * Validate items array
 * @private
 * @param {Array} items - Items to validate
 * @returns {boolean} True if valid
 */
function isValidItemsArray(items) {
  return items && Array.isArray(items);
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate total price from items array
 * @param {Array<{price: number, quantity: number}>} items - Array of items with price and quantity
 * @returns {number} Total price before discounts and taxes
 * @example
 * calculateTotal([{ price: 10, quantity: 2 }, { price: 5, quantity: 3 }])
 * // Returns: 35
 */
function calculateTotal(items) {
  if (!isValidItemsArray(items)) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const price = parseNumeric.price(item.price);
    const quantity = parseNumeric.quantity(item.quantity);
    return total + (price * quantity);
  }, 0);
}

/**
 * Calculate discount based on total price using tiered discount structure
 * @param {number} totalPrice - Total price before discount
 * @returns {number} Discount amount
 * @example
 * calculateDiscount(1200) // Returns: 180 (15% of 1200)
 * calculateDiscount(600)  // Returns: 60 (10% of 600)
 * calculateDiscount(150)  // Returns: 7.5 (5% of 150)
 * calculateDiscount(50)   // Returns: 0 (no discount)
 */
function calculateDiscount(totalPrice) {
  for (const tier of DISCOUNT_TIERS) {
    if (totalPrice >= tier.threshold) {
      return totalPrice * tier.rate;
    }
  }
  return 0;
}

/**
 * Calculate tax based on price and tax rate
 * @param {number} price - Price to calculate tax on
 * @param {number} [taxRate=0.08] - Tax rate as decimal (0.08 = 8%)
 * @returns {number} Tax amount
 * @example
 * calculateTax(100, 0.08) // Returns: 8
 */
function calculateTax(price, taxRate = DEFAULT_TAX_RATE) {
  return price * taxRate;
}

/**
 * Calculate final price with complete breakdown including discount and tax
 * @param {Array<{price: number, quantity: number}>} items - Array of items
 * @param {number} [taxRate=0.08] - Tax rate as decimal (optional)
 * @returns {Object} Complete pricing breakdown
 * @returns {number} returns.subtotal - Total before discounts and taxes
 * @returns {number} returns.discount - Discount amount applied
 * @returns {number} returns.priceAfterDiscount - Price after discount, before tax
 * @returns {number} returns.tax - Tax amount
 * @returns {number} returns.finalPrice - Final price including all calculations
 * @example
 * calculateFinalPrice([{ price: 100, quantity: 2 }], 0.08)
 * // Returns: {
 * //   subtotal: 200.00,
 * //   discount: 10.00,
 * //   priceAfterDiscount: 190.00,
 * //   tax: 15.20,
 * //   finalPrice: 205.20
 * // }
 */
function calculateFinalPrice(items, taxRate = DEFAULT_TAX_RATE) {
  const subtotal = calculateTotal(items);
  const discount = calculateDiscount(subtotal);
  const priceAfterDiscount = subtotal - discount;
  const tax = calculateTax(priceAfterDiscount, taxRate);
  const finalPrice = priceAfterDiscount + tax;
  
  return {
    subtotal: parseNumeric.round(subtotal),
    discount: parseNumeric.round(discount),
    priceAfterDiscount: parseNumeric.round(priceAfterDiscount),
    tax: parseNumeric.round(tax),
    finalPrice: parseNumeric.round(finalPrice)
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  calculateTotal,
  calculateDiscount,
  calculateTax,
  calculateFinalPrice
};

// Made with Bob
