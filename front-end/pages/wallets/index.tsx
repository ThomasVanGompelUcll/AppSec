import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/userprofile.module.css';
import Header from '@components/header';
import Footer from '@components/footer';
import Link from 'next/link';
import WalletOverviewTable from '@components/wallets/WalletOverviewTable';
import DOMPurify from 'dompurify';

const UserProfile: FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [wallets, setWallets] = useState<any[] | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetailsAndWallets = async () => {
            const token = sessionStorage.getItem('authToken');

            if (!token) {
                setErrorMessage(
                    'You are not logged in. Please log in to view your profile. heehee'
                );
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
                    throw new Error(
                        `Failed to fetch user details. Status code: ${response.status}`
                    );
                }

                const userDetails = await response.json();
                setUser(userDetails);

                const walletResponse = await fetch(
                    `http://localhost:3000/wallets/${userDetails.id}`
                );
                if (!walletResponse.ok) {
                    throw new Error(
                        `Failed to fetch wallets for user ID ${userDetails.id}. Status: ${walletResponse.status}`
                    );
                }

                const walletList = await walletResponse.json();
                setWallets(walletList);
            } catch (error) {
                console.error('Error fetching user or wallet details:', error);
                setErrorMessage('Failed to load user or wallet details. Please try again later.');
            }
        };

        fetchUserDetailsAndWallets();
    }, []);

    return (
        <>
            <Header />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <section
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                    }}
                >
                    <Link href="/addwallet">
                        <button
                            className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                            style={{ color: '#063f34' }}
                        >
                            Add Wallet
                        </button>
                    </Link>
                </section>
                <div>
                    {user ? (
                        <section>
                            {wallets && <WalletOverviewTable wallets={wallets} user={user} />}
                        </section>
                    ) : (
                        <p
                            className="text-center mt-8"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(errorMessage || ''),
                            }}
                        ></p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default UserProfile;
