import Footer from '@components/footer';
import Header from '@components/header';
import { TransactionInput } from '@types';
import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import DOMPurify from 'dompurify';

type Props = {
    loggedInUserId?: number;
};

const validateNotEmpty = (strValue: string): boolean => {
    return strValue.trim().length > 0;
};

const AddTransaction: React.FC<Props> = ({ loggedInUserId }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userId, setUserId] = useState<number | null>(loggedInUserId || null);
    const [wallets, setWallets] = useState<{ id: number; name: string }[]>([]);
    const [transactionInput, setTransactionInput] = useState<TransactionInput>({
        category: '',
        expense: true,
        currency: '',
        amount: 0,
        dateTime: new Date(),
        walletId: 0,
        userId: userId ?? 0,
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const currencies = ['EUR', 'USD', 'GBP']; // Supported currencies

    // Retrieve the logged-in user ID and associated wallets
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/users/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch user. Status: ${response.status}`);
                }

                const userData = await response.json();
                setUserId(userData.id); // Set userId here
                setTransactionInput((prevInput) => ({
                    ...prevInput,
                    userId: userData.id,
                }));
            } catch (err) {
                console.error('Failed to fetch user details:', err);
                router.push('/login');
            }
        };

        if (!loggedInUserId) {
            fetchUserDetails();
            fetchWallets();
        }
    }, [loggedInUserId]);
    const fetchWallets = async () => {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            setErrorMessage('You are not logged in. Please log in to view your wallets.');
            return;
        }

        try {
            const walletsResponse = await fetch('http://localhost:3000/wallets/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!walletsResponse.ok) {
                throw new Error(`Failed to fetch subscriptions. Status: ${walletsResponse.status}`);
            }

            const walletsList = await walletsResponse.json();
            console.log('heeeeeeee:', walletsList);
            setWallets(walletsList);
        } catch (error) {
            console.error('Error fetching user or subscriptions:', error);
            setErrorMessage('Failed to load user or subscription data. Please try again later.');
        }
        const userResponse = await fetch('http://localhost:3000/users/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
    };

    const handleBackClick = () => {
        router.push('/transactions');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setTransactionInput((prevInput) => ({
            ...prevInput,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleCreateTransaction = async () => {
        if (
            !validateNotEmpty(transactionInput.category) ||
            !validateNotEmpty(transactionInput.currency) ||
            !transactionInput.walletId
        ) {
            alert('Please enter valid values for all fields.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionInput),
            });

            if (!response.ok) {
                throw new Error('Failed to create transaction');
            }

            const newTransaction = await response.json();
            alert(`Transaction in '${newTransaction.currency}' created successfully!`);
            console.log('New Transaction:', newTransaction);

            router.push('/transactions');
        } catch (error) {
            setError(
                (error as Error).message || 'An error occurred while creating the transaction'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Add Transaction</title>
                <meta name="description" content="Add a new transaction" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className={`${styles.main} p-6 flex-grow flex flex-col items-center`}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: '2rem',
                            borderRadius: '1.5rem',
                        }}
                    >
                        <h3>Enter Transaction Category</h3>
                        <input
                            type="text"
                            name="category"
                            value={transactionInput.category}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />

                        <h3>Transaction Type</h3>
                        <select
                            name="expense"
                            value={transactionInput.expense ? 'expense' : 'income'}
                            onChange={(e) =>
                                setTransactionInput((prevInput) => ({
                                    ...prevInput,
                                    expense: e.target.value === 'expense',
                                }))
                            }
                            className="border p-2 rounded"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>

                        <h3>Select Currency</h3>
                        <select
                            name="currency"
                            value={transactionInput.currency}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        >
                            <option value="" disabled>
                                Select Currency
                            </option>
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>

                        <h3>Select Wallet</h3>
                        <select
                            name="walletId"
                            value={transactionInput.walletId}
                            onChange={(e) =>
                                setTransactionInput((prevInput) => ({
                                    ...prevInput,
                                    walletId: parseInt(e.target.value, 10),
                                }))
                            }
                            className="border p-2 rounded"
                        >
                            <option value="" disabled>
                                Select Wallet
                            </option>
                            {wallets.map((wallet) => (
                                <option key={wallet.id} value={wallet.id}>
                                    {wallet.name}
                                </option>
                            ))}
                        </select>

                        <h3>Enter Amount</h3>
                        <input
                            type="number"
                            name="amount"
                            value={transactionInput.amount || ''}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                            style={{ marginBottom: '3rem' }}
                        />

                        {error && (
                            <p
                                style={{ color: 'red' }}
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(error) }}
                            ></p>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginBottom: '5rem',
                            }}
                        >
                            <button
                                onClick={handleCreateTransaction}
                                disabled={loading}
                                className="dp-flex text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
                                style={{ color: '#063f34' }}
                            >
                                {loading ? 'Posting...' : 'Create Transaction'}
                            </button>

                            <button
                                onClick={handleBackClick}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Back to Transactions
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default AddTransaction;
