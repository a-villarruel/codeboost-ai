/**
 * Pricing Service
 * Handles all pricing calculations for orders
 */

/**
 * Calculate total price from items array
 * @param {Array} items - Array of items with price and quantity
 * @returns {number} Total price
 */
function calculateTotal(items) {
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return total + (price * quantity);
  }, 0);
}

/**
 * Calculate discount based on total price
 * @param {number} totalPrice - Total price before discount
 * @returns {number} Discount amount
 */
function calculateDiscount(totalPrice) {
  if (totalPrice >= 1000) {
    // 15% discount for orders over $1000
    return totalPrice * 0.15;
  } else if (totalPrice >= 500) {
    // 10% discount for orders over $500
    return totalPrice * 0.10;
  } else if (totalPrice >= 100) {
    // 5% discount for orders over $100
    return totalPrice * 0.05;
  }
  
  return 0;
}

/**
 * Calculate tax based on price
 * @param {number} price - Price to calculate tax on
 * @param {number} taxRate - Tax rate (default 0.08 = 8%)
 * @returns {number} Tax amount
 */
function calculateTax(price, taxRate = 0.08) {
  return price * taxRate;
}

/**
 * Calculate final price with discount and tax
 * @param {Array} items - Array of items
 * @param {number} taxRate - Tax rate (optional)
 * @returns {Object} Pricing breakdown
 */
function calculateFinalPrice(items, taxRate = 0.08) {
  const subtotal = calculateTotal(items);
  const discount = calculateDiscount(subtotal);
  const priceAfterDiscount = subtotal - discount;
  const tax = calculateTax(priceAfterDiscount, taxRate);
  const finalPrice = priceAfterDiscount + tax;
  
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    priceAfterDiscount: parseFloat(priceAfterDiscount.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2))
  };
}

module.exports = {
  calculateTotal,
  calculateDiscount,
  calculateTax,
  calculateFinalPrice
};

// Made with Bob
