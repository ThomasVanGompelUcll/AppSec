import { Transaction } from "../../model/transaction";
import { User } from "../../model/user";
import { Wallet } from "../../model/wallet";
import { Currency } from "../../types/index";

const user = new User({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 20,
    email: 'john.doe@ucll.be',
    password: 'john123',
    phoneNumber: '1234567890',
    personalNumber: 1,
    role: 'user',
    wallets: [],
    transactions: []
})

const wallet = new Wallet({
    walletId: 1,
    currency: 'EUR',
    creationDate: new Date(),
    amount: 1000,
    owner: user,
    users: [],
    subscriptions: [],
    transactions: []
})

test('given: valid values for transaction; when: transaction is created; then: transaction should be successfully created', () => {
    const transaction = new Transaction({
        id: 1,
        category: 'Fortnite',
        expense: true,
        currency: 'EUR',
        amount: 50,
        dateTime: new Date(),
        wallet: wallet,
        user: user
    });

    expect(transaction.getCategory()).toBe('Fortnite');
    expect(transaction.getExpense()).toBe(true);
    expect(transaction.getCurrency()).toBe('EUR');
    expect(transaction.getAmount()).toBe(50);
    expect(transaction.getDateTime()).toBeInstanceOf(Date);
});

test('given: missing category; when: transaction is validated; then: validation should fail', () => {
    const createNewTransaction = () => {
        new Transaction({
            id: 1,
            category: '',
            expense: true,
            currency: 'EUR' as Currency,
            amount: 50,
            dateTime: new Date(),
            wallet: wallet,
            user: user
        });
    };

    expect(createNewTransaction).toThrow('Invalid or missing category');
});

test('given: missing expense; when: transaction is validated; then: validation should fail', () => {
    const createNewTransaction = () => {
        new Transaction({
            id: 1,
            category: 'Groceries',
            expense: undefined as unknown as boolean,
            currency: 'EUR' as Currency,
            amount: 50,
            dateTime: new Date(),
            wallet: wallet,
            user: user
        });
    };

    expect(createNewTransaction).toThrow('Invalid or missing expense');
});

test('given: missing currency; when: transaction is validated; then: validation should fail', () => {
    const createNewTransaction = () => {
        new Transaction({
            id: 1,
            category: 'Groceries',
            expense: true,
            currency: '' as Currency,
            amount: 50,
            dateTime: new Date(),
            wallet: wallet,
            user: user
        });
    };

    expect(createNewTransaction).toThrow('Invalid or missing currency');
});

test('given: missing amount; when: transaction is validated; then: validation should fail', () => {
    const createNewTransaction = () => {
        new Transaction({
            id: 1,
            category: 'Groceries',
            expense: true,
            currency: 'EUR' as Currency,
            amount: undefined as unknown as number,
            dateTime: new Date(),
            wallet: wallet,
            user: user
        });
    };

    expect(createNewTransaction).toThrow('Invalid or missing amount');
});

test('given: missing dateTime; when: transaction is validated; then: validation should fail', () => {
    const createNewTransaction = () => {
        new Transaction({
            id: 1,
            category: 'Groceries',
            expense: true,
            currency: 'EUR' as Currency,
            amount: 50,
            dateTime: undefined as unknown as Date,
            wallet: wallet,
            user: user
        });
    };

    expect(createNewTransaction).toThrow('Invalid or missing dateTime');
});