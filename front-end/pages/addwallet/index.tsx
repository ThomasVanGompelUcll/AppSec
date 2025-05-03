import Footer from '@components/footer';
import Header from '@components/header';
import { TransformedWallet, WalletInput, User } from '@types';
import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';

const validateNotEmpty = (strValue: string): boolean => strValue.trim().length > 0;

const AddWallet: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [walletInput, setWalletInput] = useState<WalletInput>({
        name: '',
        currency: '',
        amount: 0,
        ownerId: 0,
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const currencies = ['EUR', 'USD', 'GBP'];

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

                const userData: User = await response.json();
                setUser(userData);
                if (userData.id !== undefined) {
                    setWalletInput((prev) => ({
                        ...prev,
                        ownerId: userData.id ?? 0, // fallback to 0 if undefined (or choose another safe default)
                    }));
                } else {
                    console.error('User ID is undefined');
                }
            } catch (err) {
                console.error('User fetch failed:', err);
                router.push('/login');
            }
        };

        fetchUserDetails();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setWalletInput((prevInput) => ({
            ...prevInput,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleCreateWallet = async () => {
        if (!validateNotEmpty(walletInput.name) || !validateNotEmpty(walletInput.currency)) {
            alert('Please enter valid values for Name and Currency.');
            return;
        }

        setLoading(true);
        setError('');

        const token = sessionStorage.getItem('authToken');
        if (!token) {
            setError('No auth token found. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/wallets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(walletInput),
            });

            if (!response.ok) {
                throw new Error('Failed to create wallet');
            }

            const newWallet: TransformedWallet = await response.json();
            alert(`new wallet created successfully!`);
            router.push('/wallets');
        } catch (error) {
            setError((error as Error).message || 'An error occurred while creating the wallet');
        } finally {
            setLoading(false);
        }
    };

    const handleBackClick = () => {
        router.push('/wallets');
    };

    return (
        <>
            <Head>
                <title>Add Wallet</title>
                <meta name="description" content="Add a new wallet" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className={`${styles.main} p-6 flex-grow flex flex-col items-center`}>
                    <div className="flex flex-col text-center p-8 rounded-xl">
                        <h3>Enter Wallet Name</h3>
                        <input
                            type="text"
                            name="name"
                            value={walletInput.name}
                            onChange={handleInputChange}
                            className="border p-2 rounded"
                        />

                        <h3>Select Currency</h3>
                        <select
                            name="currency"
                            value={walletInput.currency}
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

                        <h3>Enter Amount</h3>
                        <input
                            type="number"
                            name="amount"
                            value={walletInput.amount || ''}
                            onChange={handleInputChange}
                            className="border p-2 rounded mb-12"
                        />

                        {error && <p className="text-red-500">{error}</p>}

                        <div className="flex flex-row justify-evenly mb-20">
                            <button
                                onClick={handleCreateWallet}
                                disabled={loading}
                                className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 m-2"
                                style={{ color: '#063f34' }}
                            >
                                {loading ? 'Posting...' : 'Create Wallet'}
                            </button>

                            <button
                                onClick={handleBackClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Back to Wallets
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
};

export default AddWallet;
