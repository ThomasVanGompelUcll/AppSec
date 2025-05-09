import { FC, useEffect, useState } from 'react';
import styles from '@styles/userprofile.module.css';
import { useRouter } from 'next/router';
import Header from '@components/header';
import Footer from '@components/footer';
import DOMPurify from 'dompurify';
import WalletOverviewTable from '@components/wallets/WalletOverviewTable';
import Link from 'next/link';

const UserProfile: FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [wallets, setWallets] = useState<any | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter();
    const sanitizedError =
        typeof window !== 'undefined' ? DOMPurify.sanitize(errorMessage || '') : '';

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/me', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    const refreshResponse = await fetch('http://localhost:3000/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (!refreshResponse.ok) {
                        throw new Error('Failed to refresh token.');
                    }

                    const retryResponse = await fetch('http://localhost:3000/users/me', {
                        method: 'GET',
                        credentials: 'include',
                    });

                    if (!retryResponse.ok) {
                        throw new Error(
                            `Failed to fetch user profile. Status code: ${retryResponse.status}`
                        );
                    }

                    const userProfile = await retryResponse.json();
                    setUser(userProfile);
                } else if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user profile. Status code: ${response.status}`
                    );
                } else {
                    const userProfile = await response.json();
                    setUser(userProfile);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setErrorMessage('Failed to load profile. Please try again later.');
            }
        };

        fetchUserProfile();
    }, []); // Only runs on component mount

    useEffect(() => {
        if (user) {
            console.log('User state updated:', user);
            fetchWallets(); // Fetch wallets after user is set
        }
    }, [user]); // Runs whenever `user` changes

    const fetchWallets = async () => {
        if (user) {
            try {
                const response = await fetch(`http://localhost:3000/wallets/${user.id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch wallets. Status code: ${response.status}`);
                }

                const walletList = await response.json();
                setWallets(walletList);
            } catch (error) {
                console.error('Error fetching wallets:', error);
                setErrorMessage('Failed to load wallets. Please try again later.');
            }
        }
    };

    return (
        <>
            <Header />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className={styles.container}>
                    <div className={styles.profile}>
                        <Link href="/addwallet">
                            <button
                                className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                                style={{ color: '#063f34' }}
                            >
                                Add Wallet
                            </button>
                        </Link>
                        <div className={styles.profileDetails}>
                            {user ? (
                                <div>
                                    <WalletOverviewTable
                                        wallets={wallets}
                                        user={{
                                            id: user.id,
                                            name: user.name,
                                        }}
                                    ></WalletOverviewTable>
                                </div>
                            ) : errorMessage ? (
                                <p className="text-danger">{sanitizedError}</p>
                            ) : (
                                <p>Loading profile...</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default UserProfile;
