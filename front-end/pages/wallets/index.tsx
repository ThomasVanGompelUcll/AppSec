import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/userprofile.module.css';
import Header from '@components/header';
import Footer from '@components/footer';
import Link from 'next/link';
import WalletOverviewTable from '@components/wallets/WalletOverviewTable';

const UserProfile: FC = () => {
    const [user, setUser] = useState<any | null>(null);
    const [wallets, setWallets] = useState<any[] | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const loggedInUser = sessionStorage.getItem('loggedInUser');

            if (!loggedInUser) {
                // No logged-in user; render the page without user-specific details
                return;
            }

            const user = JSON.parse(loggedInUser);

            try {
                const response = await fetch(`http://localhost:3000/users/${user.id}`);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user details. Status code: ${response.status}`
                    );
                }

                const userDetails = await response.json();
                setUser(userDetails);
                fetchWallets(userDetails.id);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchWallets = async (userId: string) => {
            try {
                const response = await fetch(`http://localhost:3000/wallets/${userId}`);
                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch wallets for user ID ${userId}. Status: ${response.status}`
                    );
                }

                const walletList = await response.json();
                setWallets(walletList);
            } catch (error) {
                console.error('Error fetching wallets:', error);
            }
        };

        fetchUserDetails();
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
                        <p className="text-center mt-8">
                            No user is currently logged in. Log in to manage wallets or view
                            transactions.
                        </p>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default UserProfile;
