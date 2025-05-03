import { Wallet } from "../../model/wallet";
import { User } from "../../model/user";
import { Currency, Role } from "../../types/index";

const testUser = new User({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    age: 20,
    email: 'john.doe@ucll.com',
    password: 'password123',
    phoneNumber: '1234567890',
    personalNumber: 1,
    role: 'user' as Role,
    wallets: [],
    transactions: []
});

test('given: valid values for wallet; when: wallet is created; then: wallet should be successfully created', () => {

    const wallet = new Wallet({
        walletId: 1,
        currency: 'EUR' as Currency,
        creationDate: new Date(),
        amount: 1000,
        owner: testUser,
        subscriptions: [],
        transactions: []
    });

    expect(wallet.getWalletId()).toBe(1);
    expect(wallet.getCurrency()).toBe('EUR');
    expect(wallet.getCreationDate()).toBeInstanceOf(Date);
    expect(wallet.getAmount()).toBe(1000);
    expect(wallet.getOwner()).toBe(testUser);
    expect(wallet.getSubscriptions()).toEqual([]);
    expect(wallet.getTransactions()).toEqual([]);
});

test('given: missing walletId; when: wallet is validated; then: validation should fail', () => {
    const createNewWallet = () => {
        new Wallet({
            walletId: undefined as unknown as number,
            currency: 'EUR' as Currency,
            creationDate: new Date(),
            amount: 1000,
            owner: testUser,
            subscriptions: [],
            transactions: []
        });
    };

    expect(createNewWallet).toThrow('Invalid or missing walletId');
});

test('given: missing currency; when: wallet is validated; then: validation should fail', () => {
    const createNewWallet = () => {
        new Wallet({
            walletId: 1,
            currency: 'XXX' as Currency,
            creationDate: new Date(),
            amount: 1000,
            owner: testUser,
            subscriptions: [],
            transactions: []
        });
    };

    expect(createNewWallet).toThrow('Invalid or missing currency');
});

test('given: missing creationDate; when: wallet is validated; then: validation should fail', () => {
    const createNewWallet = () => {
        new Wallet({
            walletId: 1,
            currency: 'EUR' as Currency,
            creationDate: undefined as unknown as Date,
            amount: 1000,
            owner: testUser,
            subscriptions: [],
            transactions: []
        });
    };

    expect(createNewWallet).toThrow('Invalid or missing creationDate');
});

test('given: missing amount; when: wallet is validated; then: validation should fail', () => {
    const createNewWallet = () => {
        new Wallet({
            walletId: 1,
            currency: 'EUR' as Currency,
            creationDate: new Date(),
            amount: undefined as unknown as number,
            owner: testUser,
            subscriptions: [],
            transactions: []
        });
    };

    expect(createNewWallet).toThrow('Invalid or missing amount');
});

test('given: missing owner; when: wallet is validated; then: validation should fail', () => {
    const createNewWallet = () => {
        new Wallet({
            walletId: 1,
            currency: 'EUR' as Currency,
            creationDate: new Date(),
            amount: 1000,
            owner: undefined as unknown as User,
            subscriptions: [],
            transactions: []
        });
    };

    expect(createNewWallet).toThrow('Invalid or missing owner');
});