import { Transaction } from '../model/transaction';
import transactionDb from '../repository/transaction.db';
import walletDb from '../repository/wallet.db';

const exchangeRates: { [key: string]: { [key: string]: number } } = {
    USD: { EUR: 0.96, GBP: 0.78, USD: 1 },
    EUR: { USD: 1.04, GBP: 0.82, EUR: 1 },
    GBP: { USD: 1.22, EUR: 1.18, GBP: 1 },
  };
  
  const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): number => {
    if (fromCurrency === toCurrency) return amount;
  
    const rate = exchangeRates[fromCurrency]?.[toCurrency];
  
    return Math.round(amount * rate * 100) / 100;
  };

const createTransaction = async (transactionData: {
    category: string;
    expense: boolean;
    currency: string;
    amount: number;
    walletId: number;
    userId: number;
  }) => {
    const { walletId, amount, expense, userId, currency } = transactionData;
  
    const wallet = await walletDb.findUniqueWallet(walletId);
  
    if (!wallet) {
      throw new Error(`Wallet not found.`);
    }
  
    const isAuthorized = wallet.ownerId === userId || wallet.sharedUsers.some((user) => user.id === userId);
  
    if (!isAuthorized) {
      throw new Error(`User is not authorized to perform transactions on this wallet.`);
    }
  
    let convertedAmount = amount;
    if (currency !== wallet.currency) {
      convertedAmount = convertCurrency(amount, currency, wallet.currency);
    }
  
    if (expense && wallet.amount < convertedAmount) {
      throw new Error('Insufficient wallet balance for this transaction.');
    }

    walletDb.updateWalletBalance(transactionData.walletId, transactionData.amount, transactionData.expense)
  
    const transactionPayload = {
      ...transactionData,
      amount: convertedAmount,
      dateTime: new Date(),
    };
  
    console.log('Transaction Payload:', transactionPayload);
  
    return await transactionDb.createTransaction(transactionPayload);
  };
  
  const getAllTransactions = async () => {
    return await transactionDb.getAllTransactions();
  };
  


export default {   
    getAllTransactions, 
    createTransaction, 
};