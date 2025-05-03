export type Role = 'admin' | 'user';

export type User = {
    id?: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    wallets: Wallet[]
};

export type Wallet = {
    sharedUsers: any;
    ownerId: number | undefined;
    walletId : number
    name : string
    currency: string;
    creationDate: string;
    leader: string;
    amount: number;
    users: User[];
};

export type Transaction = {
    walletId(walletId: any): import("react").ReactNode | Iterable<import("react").ReactNode>;
    expense: any;
    dateTime: string | number | Date;
    id : number;
    dateAndTime: Date;
    amount: number;
    type: string;
    currency: string;
    category: string;
}

export type StatusMessage = {
    message: string;
    type: 'error' | 'success';
  }
  
export interface WalletInput {
    name: string;
    currency: string;
    amount: number;
    ownerId: number;
}

export interface TransformedWallet {
    id: number;
    currency: string;
    amount: number;
    creationDate: string;
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
    sharedUsers: Array<{
        id: number;
        firstName: string;
        lastName: string;
    }>;
    transactions: Array<{
        id: number;
        category: string;
        expense: boolean;
        amount: number;
        dateTime: string;
    }>;
    subscriptions: Array<{
        id: number;
        description: string;
        amount: number;
        frequency: string;
    }>;
}

export interface TransactionInput {
    dateTime: any;
    category: string;
    expense: boolean;
    currency: string;
    amount: number;
    // dateTime: Date;
    walletId: number;
    userId: number;
}

export interface SubscriptionInput {
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    expense: boolean;
    frequency: string;
    currency: string;
    walletId: number;
    userId: number;
}