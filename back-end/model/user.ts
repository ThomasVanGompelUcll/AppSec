import {
    User as UserPrisma,
    Wallet as WalletPrisma,
    Transaction as TransactionPrisma,
} from '@prisma/client';

import { Role } from '../types';
import * as RoleValues from '../types';
import { Wallet } from "./wallet";
import { Transaction } from "./transaction";

export class User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    phoneNumber: string;
    personalNumber: number;
    role: string;
    ownedWallets: Wallet[];
    sharedWallets: Wallet[];
    transactions: Transaction[];

    constructor(user: {
        id: number;
        firstName: string;
        lastName: string;
        age: number;
        email: string;
        password: string;
        phoneNumber: string;
        personalNumber: number;
        role: string;
        ownedWallets: Wallet[];
        sharedWallets: Wallet[];
        transactions: Transaction[];
    }) {
        this.validate(user)

        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.age = user.age;
        this.email = user.email;
        this.password = user.password;
        this.phoneNumber = user.phoneNumber;
        this.personalNumber = user.personalNumber;
        this.role = user.role;
        this.ownedWallets = user.ownedWallets;
        this.sharedWallets = user.sharedWallets;
        this.transactions = user.transactions;
    }

    validate(user: { id: number; firstName: string; lastName: string; age: number; email: string; password: string; phoneNumber: string; personalNumber: number; role: string; ownedWallets: Wallet[]; sharedWallets: Wallet[]; transactions: Transaction[]; }) {
        if (!user.id || typeof user.id !== 'number') {
            throw new Error('Invalid or missing id');
        }
        if (!user.firstName || typeof user.firstName !== 'string') {
            throw new Error('Invalid or missing firstName');
        }
        if (!user.lastName || typeof user.lastName !== 'string') {
            throw new Error('Invalid or missing lastName');
        }
        if (!user.age || typeof user.age !== 'number') {
            throw new Error('Invalid or missing age');
        }
        if (user.age < 16 || user.age > 120) {
            throw new Error('Age must be 16 or higher, or 120 or lower.');
        }
        if (!user.email || typeof user.email !== 'string' || !this.isValidEmail(user.email)) {
            throw new Error('Invalid or missing email');
        }
        if (!user.password || typeof user.password !== 'string') {
            throw new Error('Invalid or missing password');
        }
        if (!user.phoneNumber || typeof user.phoneNumber !== 'string') {
            throw new Error('Invalid or missing phoneNumber');
        }
        if (!user.personalNumber || typeof user.personalNumber !== 'number') {
            throw new Error('Invalid or missing personalNumber');
        }
        if (!user.role || !['user', 'owner', 'admin'].includes(user.role)) {
            throw new Error('Invalid or missing role');
        }
        // if (!Array.isArray(user.ownedWallets)) {
        //     throw new Error('Invalid or missing ownedWallets');
        // }
        // if (!Array.isArray(user.sharedWallets)) {
        //     throw new Error('Invalid or missing sharedWallets');
        // }
        // if (!Array.isArray(user.transactions)) {
        //     throw new Error('Invalid or missing transactions');
        // }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getId(): number {
        return this.id;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getAge(): number {
        return this.age;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getPhoneNumber(): string {
        return this.phoneNumber;
    }

    getPersonalNumber(): number {
        return this.personalNumber;
    }

    getRole(): string {
        return this.role;
    }

    getOwnedWallets(): Wallet[] {
        return this.ownedWallets;
    }

    getSharedWallets(): Wallet[] {
        return this.sharedWallets;
    }

    getTransactions(): Transaction[] {
        return this.transactions;
    }

    // equals(user: User): boolean {
    //     return (
    //         this.username === user.getUsername() &&
    //         this.firstName === user.getFirstName() &&
    //         this.lastName === user.getLastName() &&
    //         this.email === user.getEmail() &&
    //         this.password === user.getPassword() &&
    //         this.role === user.getRole()
    //     );
    // }
    // static from({
    //     id,
    //     firstName,
    //     lastName,
    //     age,
    //     email,
    //     password,
    //     phoneNumber,
    //     personalNumber,
    //     role,
    //     wallets,
    //     transactions
    // }: UserPrisma & {
    //     wallets: WalletPrisma[];
    //     transactions: TransactionPrisma[];
    // }) {
    //     return new User({
    //         id,
    //         firstName,
    //         lastName,
    //         age,
    //         email,
    //         password,
    //         phoneNumber,
    //         personalNumber,
    //         role: role as Role,
    //         wallets: wallets.map(wallet => Wallet.from({
    //             ...wallet,
    //             owner: { id: wallet.ownerId, firstName: '', lastName: '', age: 0, email: '', password: '', phoneNumber: '', personalNumber: 0, role: '' },
    //             sharedUsers: [],
    //             subscriptions: [],
    //             transactions: []
    //         })),
    //         transactions: transactions.map(transaction => Transaction.from({
    //             ...transaction,
    //             wallet: { id: transaction.walletId, currency: '', creationDate: new Date(), amount: 0, ownerId: 0 },
    //             user: { id: transaction.userId, firstName: '', lastName: '', age: 0, email: '', password: '', phoneNumber: '', personalNumber: 0, role: '' }
    //         }))
    //     });
    // }

}
