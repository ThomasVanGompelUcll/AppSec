import { Subscription } from "../model/subscription"

// Happy case: Valid subscription
test('given: valid subscription details; when: subscription is created; then: subscription is valid', () => {
    const amount = 100
    const startDate = new Date('2024-01-01')
    const endDate = new Date('2024-12-31')
    const frequency = "monthly"
    const type = "premium"
    const currency = "USD"
    const category = 'entertainment'

  const subscription = new Subscription({amount, startDate, endDate, frequency, type, currency, category});

  expect(subscription.amount).toEqual(100);
  expect(subscription.startDate).toEqual(new Date('2024-01-01'));
  expect(subscription.endDate).toEqual(new Date('2024-12-31'));
  expect(subscription.frequency).toEqual('monthly');
  expect(subscription.type).toEqual('premium');
  expect(subscription.currency).toEqual('USD');
  expect(subscription.category).toEqual('entertainment');
});

// Unhappy case: Missing required parameters
test('given: missing required subscription details; when: subscription is created; then: throws error', () => {

  expect(() => {
      new Subscription({
        amount: -50, // Invalid amount (negative)
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        frequency: 'monthly',
        type: 'premium',
        currency: 'USD',
        category: 'entertainment',
      });
    }).toThrowError('Amount cant be negative or 0'); // Assuming this is the error message your Subscription class throws
  });
