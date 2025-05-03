import { Subscription } from '../model/subscription';
import subscriptionDb from '../repository/subscription.db';
import transactionDb from '../repository/transaction.db';
import walletDb from '../repository/wallet.db';
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
    const wallet = await walletDb.findUniqueWallet(subscription.walletId);
  
    if (!wallet) {
      throw new Error(`Wallet with ID ${subscription.walletId} does not exist.`);
    }
  
    const isAuthorized =
      wallet.ownerId === subscription.userId ||
      wallet.sharedUsers.some((user) => user.id === subscription.userId);
  
    if (!isAuthorized) {
      throw new Error(`User with ID ${subscription.userId} is not authorized to create a subscription.`);
    }
  
    return await subscriptionDb.createSubscription(subscription);
  };
  
  const deleteSubscription = async (subscriptionId: number, userId: number) => {
    const subscription = await subscriptionDb.findUniqueSubscription(subscriptionId);
  
    if (!subscription) {
      throw new Error(`Subscription with ID ${subscriptionId} does not exist.`);
    }
  
    const isAuthorized =
      subscription.wallet.ownerId === userId ||
      subscription.wallet.sharedUsers.some((user) => user.id === userId);
  
    if (!isAuthorized) {
      throw new Error(`User with ID ${userId} is not authorized to delete this subscription.`);
    }
  
    return await subscriptionDb.deleteSubscription(subscriptionId);
  };
  
  const getSubscriptionsForWallet = async (walletId: number, userId: number) => {
    const wallet = await walletDb.findUniqueWallet(walletId);
  
    if (!wallet) {
      throw new Error(`Wallet with ID ${walletId} does not exist.`);
    }
  
    const isAuthorized =
      wallet.ownerId === userId ||
      wallet.sharedUsers.some((user) => user.id === userId);
  
    if (!isAuthorized) {
      throw new Error(`User with ID ${userId} is not authorized to view subscriptions for this wallet.`);
    }
  
    return await subscriptionDb.getSubscriptionsForWallet(walletId);
  };
  
  const getAllSubscriptions = async () => {
    return await subscriptionDb.getAllSubscriptions();
  };
  
  const calculateNextTransactionDateFromStart = (
    frequency: string,
    startDate: Date,
    lastProcessedDate: Date | null,
    today: Date
  ): Date | null => {
    let currentDate = new Date(startDate);
    
    if (lastProcessedDate) {
      currentDate = new Date(lastProcessedDate);
      currentDate = calculateNextTransactionDate(frequency, currentDate);
    }
  
    while (currentDate <= today) {
      currentDate = calculateNextTransactionDate(frequency, currentDate);
  
      if (currentDate > today) {
        break;
      }
    }
  
    return currentDate > today ? currentDate : null;
  };
  
  const calculateNextTransactionDate = (frequency: string, baseDate: Date): Date => {
    const nextDate = new Date(baseDate);
  
    switch (frequency.toLowerCase()) {
      case 'daily':
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case 'weekly':
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        throw new Error(`Unsupported frequency: ${frequency}`);
    }
  
    return nextDate;
  };
  
  async function processAllSubscriptions() {
    const today = new Date();
  
    const wallets = await walletDb.getAllWallets();
  
    for (const wallet of wallets) {
      const userIds = [
        wallet.owner.id,
        ...wallet.sharedUsers.map(user => user.id), 
      ];
  
      const uniqueUserIds = [...new Set(userIds)];
  
      for (const userId of uniqueUserIds) {
        const subscriptions = await subscriptionDb.getWalletSubscriptions(userId);
  
        for (const subscription of subscriptions) {
          const { startDate, endDate, frequency, amount, description, walletId, currency, expense } = subscription;
  
          const start = new Date(startDate);
          const end = new Date(endDate);
  
          if (today < start || today > end) {
            continue;
          }
  
          const nextTransactionDate = calculateNextTransactionDateFromStart(
            frequency,
            start,
            null,
            today
          );
  
          if (nextTransactionDate && nextTransactionDate <= today) {
            await transactionDb.createTransaction({
              category: description,
              amount,
              expense,
              currency,
              dateTime: today,
              walletId,
              userId,
            });
  
            console.log(`Transaction created for subscription: ${description}`);
          }
        }
      }
    }
  }
  

export default {   createSubscription,
    deleteSubscription,
    getSubscriptionsForWallet,
    getAllSubscriptions,
    processAllSubscriptions
 };