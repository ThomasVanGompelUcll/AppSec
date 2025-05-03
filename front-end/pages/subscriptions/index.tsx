import Header from '@components/header';
import SubscriptionOverviewTable from '@components/subscriptions/SubscriptionOverviewTable';
import { SubscriptionInput, User } from '@types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import Link from 'next/link';
import Footer from '@components/footer';
import { useRouter } from 'next/router';

const Subscriptions: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Array<SubscriptionInput>>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserAndSubscriptions = async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                setErrorMessage('You are not logged in. Please log in to view your subscriptions.');
                return;
            }

            try {
                const subscriptionsResponse = await fetch(
                    'http://localhost:3000/subscriptions/me',
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!subscriptionsResponse.ok) {
                    throw new Error(
                        `Failed to fetch subscriptions. Status: ${subscriptionsResponse.status}`
                    );
                }

                const subscriptionList = await subscriptionsResponse.json();
                console.log('heeeeeeee:', subscriptionList);
                setSubscriptions(subscriptionList);
            } catch (error) {
                console.error('Error fetching user or subscriptions:', error);
                setErrorMessage(
                    'Failed to load user or subscription data. Please try again later.'
                );
            }
        };
        fetchUserAndSubscriptions();
    }, []);
    return (
        <>
            <Head>
                <title>Subscriptions</title>
                <meta name="description" content="View all your subscriptions" />
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
                    <h1>Subscriptions</h1>
                </section>
                <section className="w-full p-4">
                    {subscriptions.length > 0 ? (
                        <SubscriptionOverviewTable subscriptions={subscriptions} />
                    ) : (
                        <p className="text-center text-gray-500">No subscriptions found.</p>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Subscriptions;
