import Footer from '@components/footer';
import Header from '@components/header';
import walletService from '@services/WalletService';
import { TransformedWallet, WalletInput } from '@types';
import Head from 'next/head';
import router from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';

type Props = {
    loggedInUserId?: number; // Make it optional to dynamically retrieve it
};

const validateNotEmpty = (strValue: string): boolean => {
    return strValue.trim().length > 0;
};

const AddWallet: React.FC<Props> = ({ loggedInUserId }) => {
    const [userId, setUserId] = useState<number | null>(loggedInUserId || null);
    const [walletInput, setWalletInput] = useState<WalletInput>({
        name: '',
        currency: '',
        amount: 0,
        ownerId: userId ?? 0, // Initialize with 0; will be updated dynamically
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const currencies = ['EUR', 'USD', 'GBP']; // Supported currencies

    // Retrieve the logged-in user ID from sessionStorage if not passed as a prop
    useEffect(() => {
        if (!userId) {
            const storedUser = sessionStorage.getItem('loggedInUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUserId(parsedUser.id);
                setWalletInput((prevInput) => ({
                    ...prevInput,
                    ownerId: parsedUser.id,
                }));
            } else {
                router.push('/login'); // Redirect to login if user is not found
            }
        }
    }, [userId]);

    const handleBackClick = () => {
        router.push('/wallets');
    };

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

        try {
            const newWallet = await walletService.addWallet(walletInput);

            alert(`Wallet '${newWallet.currency}' created successfully!`);
            console.log('Transformed Wallet:', newWallet);

            router.push('/wallets');
        } catch (error) {
            setError((error as Error).message || 'An error occurred while creating the wallet');
        } finally {
            setLoading(false);
        }
    };

    console.log('id:', userId);

    const walletService = {
        addWallet: async (walletInput: WalletInput): Promise<TransformedWallet> => {
            const response = await fetch('http://localhost:3000/wallets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(walletInput),
            });

            if (!response.ok) {
                throw new Error('Failed to create wallet');
            }

            const data: TransformedWallet = await response.json();
            return data;
        },
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            textAlign: 'center',
                            padding: '2rem',
                            borderRadius: '1.5rem',
                        }}
                    >
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
                            className="border p-2 rounded"
                            style={{ marginBottom: '3rem' }}
                        />

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-evenly',
                                marginBottom: '5rem',
                            }}
                        >
                            <button
                                onClick={handleCreateWallet}
                                disabled={loading}
                                className="dp-flex text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center m-2"
                                style={{ color: '#063f34' }}
                            >
                                {loading ? 'Posting...' : 'Create Wallet'}
                            </button>

                            <button
                                onClick={handleBackClick}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
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
