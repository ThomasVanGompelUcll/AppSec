type Role = 'admin' | 'owner' | 'user';
type Currency = 'EUR' | 'USD' | 'GBP';

type UserInput = {
    id?: number;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    phoneNumber: string;
    personalNumber: number;
    role: Role;
};

export interface WalletInput {
    name: string;
    currency: string;
    amount: number;
    ownerId: number;
}

export interface TransactionInput {
    category: string;
    expense: boolean;
    currency: string;
    amount: number;
    walletId: number;
    userId: number;
    dateTime: Date;

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

export type TransformedWallet = {
    id: number;
    currency: string;
    amount: number;
    creationDate: Date;
    owner: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
    };
    sharedUsers: { id: number; firstName: string; lastName: string }[];
    transactions: {
      id: number;
      category: string;
      expense: boolean;
      amount: number;
      dateTime: Date;
    }[];
    subscriptions: {
      id: number;
      description: string;
      amount: number;
      frequency: string;
    }[];
  };

export { Role, Currency, UserInput };
