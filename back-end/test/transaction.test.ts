import { Transaction } from "../model/transaction";

// Happy case: Valid transaction
test('given: valid transaction details; when: transaction is created; then: transaction is valid', () => {
  const amount = 100;
  const dateAndTime = new Date('2024-01-01');
  const category = 'entertainment';
  const type = "premium"
  const currency = 'USD';

  const transaction = new Transaction({dateAndTime, amount, type, currency, category });

  expect(transaction.amount).toEqual(100);
  expect(transaction.dateAndTime).toEqual(new Date('2024-01-01'));
  expect(transaction.category).toEqual('entertainment');
  expect(transaction.type).toEqual('premium');
  expect(transaction.currency).toEqual('USD');
});

// Unhappy case: Invalid amount (negative)
test('given: invalid transaction amount; when: transaction is created; then: throws error', () => {
  expect(() => {
    new Transaction({
        dateAndTime: new Date('2024-01-01'),
        amount: -50, // Invalid amount (negative)
        category: 'entertainment',
        type: "premium",
        currency: 'USD',
    });
  }).toThrowError('Amount can\'t be negative or 0');
});

// Unhappy case: Invalid date (invalid date object)
test('given: invalid transaction date; when: transaction is created; then: throws error', () => {
  expect(() => {
    new Transaction({
        dateAndTime: new Date('invalid'), // Invalid date
        amount: 100,
        type: "premium",
        currency: 'USD',
        category: 'entertainment',
    });
  }).toThrowError('Invalid date');
});

// Unhappy case: Missing category
test('given: missing transaction category; when: transaction is created; then: throws error', () => {
  expect(() => {
    new Transaction({
        dateAndTime: new Date('2024-01-01'), // Invalid date
        amount: 100,
        type: "premium",
        currency: 'USD',
        category: '',
      });
  }).toThrowError('Category cannot be empty');
});

// Unhappy case: Missing currency
test('given: missing transaction currency; when: transaction is created; then: throws error', () => {
  expect(() => {
    new Transaction({
        dateAndTime: new Date('2024-01-01'), // Invalid date
        amount: 100,
        type: "premium",
        currency: '',
        category: 'enterainment',
    });
  }).toThrowError('Currency cannot be empty');
});
