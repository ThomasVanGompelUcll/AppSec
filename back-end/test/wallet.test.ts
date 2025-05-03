import { Wallet } from "../model/wallet";

test('given: valid wallet details; when: wallet is created; then: wallet is valid', () => {
  const amount = 200;
  const currency = 'USD';
  const leader = 'John Doe';
  const creationDate = new Date('2024-01-01')
  const name ='vakantie'

  const wallet = new Wallet({name, currency, creationDate, leader, amount });

  expect(wallet.amount).toEqual(200);
  expect(wallet.currency).toEqual('USD');
  expect(wallet.leader).toEqual('John Doe');
});

test('given: invalid wallet amount; when: wallet is created; then: throws error', () => {
  expect(() => {
    new Wallet({
      name : "Vakantie",
      currency: 'USD',
      creationDate: new Date('2024-01-01'),
      leader: 'John Doe',
      amount: -100,
    });
  }).toThrowError("Amount can't be negative or 0");
});


// Unhappy case: Missing currency
test('given: missing wallet currency; when: wallet is created; then: throws error', () => {
  expect(() => {
    new Wallet({
      name : "Vakantie",
      currency: '',
      creationDate: new Date('2024-01-01'),
      leader: 'John Doe',
      amount: 100, 
    });
  }).toThrowError("Currency cannot be empty");
});


// Unhappy case: Missing owner
test('given: missing wallet owner(leader); when: wallet is created; then: throws error', () => {
  expect(() => {
    new Wallet({
        name : "Vakantie",
        currency: 'EURO',
        creationDate: new Date('2024-01-01'),
        leader: '',
        amount: 100, 
    });
  }).toThrowError("Owner cannot be empty");
});


test('given: missing wallet amount; when: wallet is created; then: throws error', () => {
  expect(() => {
    new Wallet({
      name : "Vakantie",
      currency: 'USD',
      creationDate: new Date('2024-01-01'),
      leader: 'John Doe',
      amount: 0,
    });
  }).toThrowError("Amount can't be negative or 0");
});




