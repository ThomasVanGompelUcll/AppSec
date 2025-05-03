// import { create } from 'domain';
import { User } from '../model/user';
import { Wallet } from '../model/wallet';
import userDb from '../repository/user.db';
import walletDb from '../repository/wallet.db';
import { Currency, WalletInput } from '../types';
import { TransformedWallet } from '../types';
import transactionDb from '../repository/transaction.db';




const getAllWallets = async () => {
  const wallets = await walletDb.getAllWallets();
  return wallets.map(wallet => ({
    ...wallet,
    owner: {
      id: wallet.owner.id,
      firstName: wallet.owner.firstName,
      lastName: wallet.owner.lastName,
      email: wallet.owner.email,
    },
    sharedUsers: wallet.sharedUsers.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    })),
    transactions: wallet.transactions.map(transaction => ({
      id: transaction.id,
      category: transaction.category,
      expense: transaction.expense,
      amount: transaction.amount,
      dateTime: transaction.dateTime,
      userId: transaction.user?.id,
      firstName: transaction.user?.firstName,
      lastName: transaction.user?.lastName,
    })),
    subscriptions: wallet.subscriptions.map(subscription => ({
      id: subscription.id,
      description: subscription.description,
      amount: subscription.amount,
      frequency: subscription.frequency,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    })),
  }));
};
const createWallet = async (walletInput: WalletInput): Promise<TransformedWallet> => {
    const newWallet = await walletDb.createWalletWithUserId(walletInput);
    return {
        id: newWallet.id,
        currency: newWallet.currency,
        amount: newWallet.amount,
        creationDate: newWallet.creationDate,
        owner: {
            id: newWallet.owner.id,
            firstName: newWallet.owner.firstName,
            lastName: newWallet.owner.lastName,
            email: newWallet.owner.email,
          },
        sharedUsers: newWallet.sharedUsers.map(user => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
        })),
        transactions: newWallet.transactions.map(transaction => ({
          id: transaction.id,
          category: transaction.category,
          expense: transaction.expense,
          amount: transaction.amount,
          dateTime: transaction.dateTime,
        })),
        subscriptions: newWallet.subscriptions.map(subscription => ({
          id: subscription.id,
          description: subscription.description,
          amount: subscription.amount,
          frequency: subscription.frequency,
        })),
    };
}

const addUserToSharedWallet = async (walletId: number, userId: number) => {
    return await walletDb.addUserToSharedWallet(walletId, userId);
};

const removeUserFromSharedWallet = async (walletId: number, userId: number) => {
  return await walletDb.removeUserFromSharedWallet(walletId, userId);
};

const getWalletByUserId = async (userId: number) => {
  return await walletDb.getWalletByUserId(userId);
}

export default { 
  getAllWallets, 
  createWallet, 
  addUserToSharedWallet, 
  removeUserFromSharedWallet,
  getWalletByUserId
 };