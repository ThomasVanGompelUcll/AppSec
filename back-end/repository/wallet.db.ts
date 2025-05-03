import { Wallet } from '../model/wallet';
import { User } from '../model/user';
import database from './database'
import { WalletInput } from '../types';

const getAllWallets = async () => {
    return await database.wallet.findMany({
        include: {
            owner: true,
            sharedUsers: true,
            transactions: {
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            subscriptions: true,
        },
    });
};
const createWalletWithUserId = async(wallet: WalletInput) => {
    return await database.wallet.create({
        data: {
            name: wallet.name,
            currency: wallet.currency,
            creationDate: new Date(),
            amount: wallet.amount,
            ownerId: wallet.ownerId,
        },
        include: {
          owner: true,
          sharedUsers: true,
          transactions: true,
          subscriptions: true,
        },
    });
}

const addUserToSharedWallet = async (walletId: number, userId: number) => {
    console.log("User ID:", userId);

    const user = await database.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    const wallet = await database.wallet.findUnique({
        where: { id: walletId },
        include: { sharedUsers: true },
    });

    if (!wallet) {
        throw new Error(`Wallet with ID ${walletId} does not exist.`);
    }

    const isAlreadyShared = wallet.sharedUsers.some((sharedUser) => sharedUser.id === userId);
    if (isAlreadyShared) {
        throw new Error(`User with ID ${userId} is already sharing this wallet.`);
    }

    return await database.wallet.update({
        where: { id: walletId },
        data: {
            sharedUsers: {
                connect: { id: userId },
            },
        },
        include: {
            owner: true,
            sharedUsers: true,
            transactions: true,
            subscriptions: true,
        },
    });
};

const findUniqueWallet = async (id: number) => {
    return await database.wallet.findUnique({
        where: { id },
        include: { 
            sharedUsers: true, 
            owner: true,
        },
    });
};

const updateWalletBalance = async (id: number, amount: number, isExpense: boolean) => {
    return await database.wallet.update({
      where: { id },
      data: {
        amount: isExpense
          ? { decrement: amount }
          : { increment: amount },
      },
    });
};

const removeUserFromSharedWallet = async (walletId: number, userId: number) => {
    console.log("Removing User ID:", userId);

    const user = await database.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    const wallet = await database.wallet.findUnique({
        where: { id: walletId },
        include: { sharedUsers: true },
    });

    if (!wallet) {
        throw new Error(`Wallet with ID ${walletId} does not exist.`);
    }

    const isShared = wallet.sharedUsers.some((sharedUser) => sharedUser.id === userId);
    if (!isShared) {
        throw new Error(`User with ID ${userId} is not sharing this wallet.`);
    }

    return await database.wallet.update({
        where: { id: walletId },
        data: {
            sharedUsers: {
                disconnect: { id: userId },
            },
        },
        include: {
            owner: true,
            sharedUsers: true,
            transactions: true,
            subscriptions: true,
        },
    });
};

const getWalletByUserId = async(id: number) => {
    const user = await database.user.findUnique({
        where: { id },
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true
        }
    });
    if (!user) {
        throw new Error(`User with ID ${id} does not exist.`);
    }
    const allWallets = [...user.ownedWallets, ...user.sharedWallets];
    return allWallets;
};


export default {
    getAllWallets, 
    createWalletWithUserId,
    addUserToSharedWallet,
    findUniqueWallet,
    updateWalletBalance,
    removeUserFromSharedWallet,
    getWalletByUserId
};