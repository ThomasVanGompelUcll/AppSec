import { Transaction } from '../model/transaction';
import { User } from '../model/user';
import { Wallet } from '../model/wallet';
import database from './database'
import walletDb from './wallet.db';

const getAllTransactions = async() => {
    return await database.transaction.findMany({
        include: {
            wallet: true,
            user: true,
        },
    });
}

const createTransaction = async (transactionData: {
    category: string;
    expense: boolean;
    currency: string;
    amount: number;
    dateTime: Date;
    walletId: number;
    userId: number;
}) => {
    return await database.transaction.create({
        data: {
            expense: transactionData.expense,
            currency: transactionData.currency,
            amount: transactionData.amount,
            dateTime: new Date(),
            wallet: {
                connect: { id: transactionData.walletId }
            },
            user: {
                connect: { id: transactionData.userId }
            },
            category: transactionData.category,
        },

    });
};

export default {
    getAllTransactions, 
    createTransaction,
};