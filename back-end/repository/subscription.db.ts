import { Subscription } from '../model/subscription';
import { Wallet } from '../model/wallet';
import { User } from '../model/user';
import database from './database';

const getAllSubscriptions = async() => {
    return await database.subscription.findMany({
        include: {
            wallet: true,
        },
    });
}
const createSubscription = async (subscription: {
    description: string;
    amount: number;
    startDate: Date;
    endDate: Date;
    expense: boolean;
    frequency: string;
    currency: string;
    walletId: number;
    userId: number;
  }) => {
    const { walletId, ...subscriptionData } = subscription;
    return await database.subscription.create({
      data: {
        ...subscriptionData,
        wallet: { connect: { id: walletId } },
      },
    });
  };

  const deleteSubscription = async (subscriptionId: number) => {
    return await database.subscription.delete({ where: { id: subscriptionId } });
  };
  
const getSubscriptionsForWallet = async (walletId: number) => {
    return await database.subscription.findMany({
      where: { walletId },
    });
  };

const findUniqueSubscription = async (id: number) => {
    return await database.subscription.findUnique({
        where: { id },
        include: { 
            wallet: { 
                include: { 
                    sharedUsers: true,
                },
            },
        },
    });
};

const getWalletSubscriptions = async (userId: number) => {
    const wallets = await database.wallet.findMany({
      where: {
        OR: [{ ownerId: userId }, { sharedUsers: { some: { id: userId } } }],
      },
      include: { subscriptions: true },
    });
  
    return wallets.flatMap(wallet => wallet.subscriptions);
  };


  const updateSubscription = async (subscriptionId: number, updateData: { [key: string]: any }) => {
    return await database.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
    });
  };


export default {
    getAllSubscriptions,
    createSubscription,
    deleteSubscription,
    getSubscriptionsForWallet,
    findUniqueSubscription,
    getWalletSubscriptions,
    updateSubscription
};