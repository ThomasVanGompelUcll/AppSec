import {
    User as UserPrisma,
    Wallet as WalletPrisma,
    Transaction as TransactionPrisma,
} from '@prisma/client';

import { Currency } from '../types';
import { User } from './user';
import { Wallet } from './wallet';


export class Transaction {
    id: number;
    category: string;
    expense: boolean;
    currency: Currency;
    amount: number;
    dateTime: Date;
    walletId: number;
    userId: number;
    wallet: Wallet;
    user: User;

    constructor(transaction: {
        id: number;
        category: string;
        expense: boolean;
        currency: Currency;
        amount: number;
        dateTime: Date;
        walletId: number;
        userId: number;
        wallet: Wallet;
        user: User;
    }) {
        this.validate(transaction)

        this.id = transaction.id;
        this.category = transaction.category;
        this.expense = transaction.expense;
        this.currency = transaction.currency;
        this.amount = transaction.amount;
        this.dateTime = transaction.dateTime;
        this.walletId = transaction.walletId;
        this.userId = transaction.userId;
        this.wallet = transaction.wallet;
        this.user = transaction.user;
    }
    validate(transaction: { category: string; expense: Boolean; currency: Currency; amount: number; dateTime: Date; }) {
        if (!transaction.category || typeof transaction.category !== 'string') {
            throw new Error('Invalid or missing category');
        }
        if (!transaction.expense) {
            throw new Error('Invalid or missing expense');
        }
        if (!transaction.currency || !['EUR', 'USD', 'GBP'].includes(transaction.currency)) {
            throw new Error('Invalid or missing currency');
        }
        if (!transaction.amount || typeof transaction.amount !== 'number') {
            throw new Error('Invalid or missing amount');
        }
        if (!transaction.dateTime || !(transaction.dateTime instanceof Date)) {
            throw new Error('Invalid or missing dateTime');
        }
    }
    getId(): number {
        return this.id;
    }

    getCategory(): string {
        return this.category;
    }

    getExpense(): Boolean {
        return this.expense;
    }

    getCurrency(): Currency {
        return this.currency;
    }

    getAmount(): number {
        return this.amount;
    }

    getDateTime(): Date {
        return this.dateTime;
    }

    getWallet(): Wallet {
        return this.wallet;
    }

    getUser(): User {
        return this.user;
    }

    // static from({
    //     id,
    //     category,
    //     expense,
    //     currency,
    //     amount,
    //     dateTime,
    //     wallet,
    //     user
    // }: TransactionPrisma & {
    //     wallet: WalletPrisma;
    //     user: UserPrisma;
    // }):Transaction {
    //     return new Transaction({
    //         id,
    //         category,
    //         expense,
    //         currency: currency as Currency,
    //         amount,
    //         dateTime,
    //         wallet: Wallet.from({
    //             ...wallet,
    //             owner: { id: wallet.ownerId, firstName: '', lastName: '', age: 0, email: '', password: '', phoneNumber: '', personalNumber: 0, role: '' },
    //             sharedUsers: [],
    //             subscriptions: [],
    //             transactions: []
    //         }),
    //         user: User.from({ ...user, wallets: [], transactions: [] })
    //     });
    // }
}