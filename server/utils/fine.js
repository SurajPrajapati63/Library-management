// Simple fine calculation: 1 currency unit per day late
function calculateFine(expectedReturnDate, actualReturnDate) {
  const expected = new Date(expectedReturnDate);
  const actual = actualReturnDate ? new Date(actualReturnDate) : new Date();
  const diff = Math.floor((actual - expected) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

module.exports = { calculateFine };
