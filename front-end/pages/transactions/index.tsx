import Header from '@components/header';
import TransactionOverviewTable from '@components/transactions/TransactionOverviewTable';
import { Transaction, User } from '@types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import Link from 'next/link';
import Footer from '@components/footer';
import { useRouter } from 'next/router';

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Array<Transaction>>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = sessionStorage.getItem('authToken');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:3000/transactions/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch transactions: ${response.statusText}`);
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <>
            <Head>
                <title>Transactions & Subscriptions</title>
                <meta name="description" content="View all your transactions and subscriptions" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={`${styles.main} flex-grow flex flex-col items-center`}>
                <section
                    className="flex flex-row justify-between items-center w-full"
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: '1px solid #ccc',
                    }}
                >
                    <h1>Transactions</h1>
                </section>
                <section className="w-full p-4">
                    {transactions.length > 0 ? (
                        <TransactionOverviewTable transactions={transactions} />
                    ) : (
                        <p className="text-center text-gray-500">No transactions found.</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Transactions;
