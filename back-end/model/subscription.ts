import {
    Wallet as WalletPrisma,
    Subscription as SubscriptionPrisma,
} from '@prisma/client';

import { Currency } from '../types';
import { Wallet } from './wallet';


export class Subscription {
    id: number;
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    expense: boolean;
    frequency: string;
    currency: Currency;
    walletId: number;
    wallet: Wallet;
    userId: number;

    constructor(subscription: {
        id: number;
        description: string;
        amount: number;
        startDate: Date;
        endDate: Date;
        expense: boolean;
        frequency: string;
        currency: Currency;
        walletId: number;
        wallet: Wallet;
        userId: number;

    }) {
        this.validate(subscription)

        this.id = subscription.id;
        this.description = subscription.description;
        this.amount = subscription.amount;
        this.startDate = subscription.startDate;
        this.endDate = subscription.endDate;
        this.expense = subscription.expense;
        this.frequency = subscription.frequency;
        this.currency = subscription.currency;
        this.walletId = subscription.walletId;
        this.wallet = subscription.wallet;
        this.userId = subscription.userId;
    }


    validate(subscription: { id: number; description: string; amount: number; startDate: Date; endDate: Date; expense: boolean; frequency: string; currency: Currency; walletId: number; wallet: Wallet; }) {
        if (!subscription.id || typeof subscription.id !== 'number') {
            throw new Error('Invalid or missing id');
        }
        if (!subscription.description || typeof subscription.description !== 'string') {
            throw new Error('Invalid or missing description');
        }
        if (!subscription.amount || typeof subscription.amount !== 'number') {
            throw new Error('Invalid or missing amount');
        }
        if (!subscription.startDate || !(subscription.startDate instanceof Date)) {
            throw new Error('Invalid or missing startDate');
        }
        if (!subscription.endDate || !(subscription.endDate instanceof Date)) {
            throw new Error('Invalid or missing endDate');
        }
        if (typeof subscription.expense !== 'boolean') {
            throw new Error('Invalid or missing expense');
        }
        if (!subscription.frequency || typeof subscription.frequency !== 'string') {
            throw new Error('Invalid or missing frequency');
        }
        if (!subscription.currency || typeof subscription.currency !== 'string') {
            throw new Error('Invalid or missing currency');
        }
        if (!subscription.walletId || typeof subscription.walletId !== 'number') {
            throw new Error('Invalid or missing walletId');
        }
        if (!subscription.wallet || !(subscription.wallet instanceof Wallet)) {
            throw new Error('Invalid or missing wallet');
        }
    }

    getId(): number {
        return this.id;
    }

    getDescription(): string {
        return this.description;
    }

    getAmount(): number {
        return this.amount;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getExpense(): boolean {
        return this.expense;
    }

    getFrequency(): string {
        return this.frequency;
    }

    getCurrency(): Currency {
        return this.currency;
    }

    getWalletId(): number {
        return this.walletId;
    }

    getWallet(): Wallet {
        return this.wallet;
    }

    getUserId(): number {
        return this.userId;
    }
    // static from({
    //     id,
    //     description,
    //     amount,
    //     startDate,
    //     endDate,
    //     expense,
    //     frequency,
    //     currency,
    //     wallet
    // }: SubscriptionPrisma & {
    //     wallet: WalletPrisma;
    // }) {
    //     return new Subscription({
    //         id,
    //         description,
    //         amount,
    //         startDate,
    //         endDate,
    //         expense,
    //         frequency,
    //         currency: currency as Currency,
    //         wallet: Wallet.from(wallet)
    //     });
    // }
}