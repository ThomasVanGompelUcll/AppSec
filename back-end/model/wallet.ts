import {
    User as UserPrisma,
    Wallet as WalletPrisma,
    Transaction as TransactionPrisma,
    Subscription as SubscriptionPrisma,

} from '@prisma/client';

import { User } from "./user";
import { Subscription } from "./subscription";
import { Transaction } from "./transaction";
import { Currency } from '../types';


export class Wallet {
    id: number;
    name: string;
    currency: Currency;
    creationDate: Date;
    amount: number;
    ownerId: number;
    owner: User;
    sharedUsers: User[];
    transactions: Transaction[];
    subscriptions: Subscription[];

    constructor(wallet: {
        id: number;
        name: string;
        currency: Currency;
        creationDate: Date;
        amount: number;
        ownerId: number;
        owner: User;
        sharedUsers: User[];
        transactions: Transaction[];
        subscriptions: Subscription[];
    }) {
        this.validate(wallet)

        this.id = wallet.id;
        this.name = wallet.name,
        this.currency = wallet.currency;
        this.creationDate = wallet.creationDate;
        this.amount = wallet.amount;
        this.ownerId = wallet.ownerId;
        this.owner = wallet.owner;
        this.sharedUsers = wallet.sharedUsers;
        this.transactions = wallet.transactions;
        this.subscriptions = wallet.subscriptions;
    }
    
    validate(wallet: { id: number; name: string, currency: Currency; creationDate: Date; amount: number; ownerId: number; owner: User; sharedUsers: User[]; transactions: Transaction[]; subscriptions: Subscription[]; }) {
        if (!wallet.id || typeof wallet.id !== 'number') {
            throw new Error('Invalid or missing id');
        }
        if (!wallet.name || typeof wallet.name !== 'string') {
            throw new Error('Invalid or missing currency');
        }
        if (!wallet.currency || typeof wallet.currency !== 'string') {
            throw new Error('Invalid or missing currency');
        }
        if (!wallet.creationDate || !(wallet.creationDate instanceof Date)) {
            throw new Error('Invalid or missing creationDate');
        }
        if (!wallet.amount || typeof wallet.amount !== 'number') {
            throw new Error('Invalid or missing amount');
        }
        if (!wallet.ownerId || typeof wallet.ownerId !== 'number') {
            throw new Error('Invalid or missing ownerId');
        }
        if (!wallet.owner || !(wallet.owner instanceof User)) {
            throw new Error('Invalid or missing owner');
        }
        if (!Array.isArray(wallet.sharedUsers)) {
            throw new Error('Invalid or missing sharedUsers');
        }
        if (!Array.isArray(wallet.transactions)) {
            throw new Error('Invalid or missing transactions');
        }
        if (!Array.isArray(wallet.subscriptions)) {
            throw new Error('Invalid or missing subscriptions');
        }
    }

    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCurrency(): Currency {
        return this.currency;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getAmount(): number {
        return this.amount;
    }

    getOwnerId(): number {
        return this.ownerId;
    }

    getOwner(): User {
        return this.owner;
    }

    getSharedUsers(): User[] {
        return this.sharedUsers;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    getSubscriptions(): Subscription[] {
        return this.subscriptions;
    }

    // static from({
    //     id,
    //     currency,
    //     creationDate,
    //     amount,
    //     owner,
    //     sharedUsers,
    //     subscriptions,
    //     transactions
    // }: WalletPrisma & {
    //     owner: UserPrisma;
    //     sharedUsers: UserPrisma[];
    //     subscriptions: SubscriptionPrisma[];
    //     transactions: TransactionPrisma[];
    // }): Wallet {
    //     return new Wallet({
    //         walletId: id,
    //         currency: currency as Currency,
    //         creationDate,
    //         amount,
    //         owner: User.from({ ...owner, wallets: [], transactions: [] }),
    //         sharedUsers: sharedUsers.map(user => User.from({ ...user, wallets: [], transactions: [] })),
    //         subscriptions: subscriptions.map(subscription => Subscription.from({ ...subscription, wallet: { id, currency, creationDate, amount, ownerId: owner.id } })),
    //         transactions: transactions.map(transaction => Transaction.from({
    //             ...transaction,
    //             wallet: { id, currency, creationDate, amount, ownerId: owner.id },
    //             user: { id: transaction.userId, firstName: '', lastName: '', age: 0, email: '', password: '', phoneNumber: '', personalNumber: 0, role: '' }
    //         }))
    //     });
    // }
}