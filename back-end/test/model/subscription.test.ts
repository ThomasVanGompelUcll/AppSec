import { Subscription } from "../../model/subscription";
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
test('given: valid values for subscription; when: subscription is created; then: subscription should be successfully created', () => {
    const subscription = new Subscription({
        subscriptionId: 1,
        description: 'Netflix',
        amount: 15,
        startDate: new Date(),
        endDate: new Date(),
        expense: true,
        frequency: 'Monthly',
        currency: 'EUR',
        wallet: wallet
    });

    expect(subscription.getSubscriptionId()).toBe(1);
    expect(subscription.getDescription()).toBe('Netflix');
    expect(subscription.getAmount()).toBe(15);
    expect(subscription.getStartDate()).toBeInstanceOf(Date);
    expect(subscription.getEndDate()).toBeInstanceOf(Date);
    expect(subscription.getExpense()).toBe(true);
    expect(subscription.getFrequency()).toBe('Monthly');
    expect(subscription.getCurrency()).toBe('EUR');
});

test('given: missing subscriptionId; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: undefined as unknown as number,
            description: 'Monthly subscription',
            amount: 15,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing subscriptionId');
});

test('given: missing description; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: '',
            amount: 15,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing description');
});

test('given: missing amount; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: 'Monthly subscription',
            amount: undefined as unknown as number,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing amount');
});

test('given: missing startDate; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: 'Monthly subscription',
            amount: 15,
            startDate: undefined as unknown as Date,
            endDate: new Date('2023-12-31'),
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing startDate');
});

test('given: missing endDate; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: 'Monthly subscription',
            amount: 15,
            startDate: new Date('2023-01-01'),
            endDate: undefined as unknown as Date,
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing endDate');
});

test('given: startDate after endDate; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: 'Monthly subscription',
            amount: 15,
            startDate: new Date('2023-12-31'),
            endDate: new Date('2023-01-01'),
            expense: true,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Start date cannot be after end date');
});

test('given: missing expense; when: subscription is validated; then: validation should fail', () => {
    const createNewSubscription = () => {
        new Subscription({
            subscriptionId: 1,
            description: 'Monthly subscription',
            amount: 15,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            expense: undefined as unknown as boolean,
            frequency: 'Monthly',
            currency: 'EUR' as Currency,
            wallet: wallet
        });
    };

    expect(createNewSubscription).toThrow('Invalid or missing type');
});