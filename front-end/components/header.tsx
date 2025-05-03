import Link from 'next/link';
import styles from '@styles/home.module.css';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        const user = sessionStorage.getItem('loggedInUser');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserName(`${parsedUser.firstName} ${parsedUser.lastName}`);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        setUserName(null);
    };

    return (
        <header className={`bg-dark bg-gradient ${styles.header}`}>
            <h3
                className={` fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white-50 text-decoration-none`}
            >
                Budgeet
            </h3>
            <nav
                className={`${styles.nav}nav justify-content-center`}
                style={{ display: 'flex', flexDirection: 'row', paddingBottom: '2rem' }}
            >
                <div className={`${styles.a}`}>
                    <Link href="/" className="nav-link px-4 fs-5 text-white">
                        Home
                    </Link>
                </div>
                <div className={`${styles.a}`}>
                    <Link href="/wallets" className="nav-link px-4 fs-5 text-white">
                        Wallets Overview
                    </Link>
                </div>

                <div className={`${styles.a}`}>
                    <Link href="/transactions" className="nav-link px-4 fs-5 text-white">
                        Transactions
                    </Link>
                </div>

                <div className={`${styles.a}`}>
                    <Link href="/subscriptions" className="nav-link px-4 fs-5 text-white">
                        Subscriptions
                    </Link>
                </div>

                <div className={`${styles.a}`}>
                    <Link href="/profile" className="nav-link px-4 fs-5 text-white">
                        Profile
                    </Link>
                </div>

                {userName ? (
                    <>
                        <button onClick={handleLogout} className={`${styles.a}`}>
                            Logout
                        </button>
                        <div className="text-white ms-5 mt-2 md:mt-0 pt-1 md:pt-0 grow">
                            Welcome, {userName}!
                        </div>
                    </>
                ) : (
                    <Link href="/loginPage" className={`${styles.a}`}>
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
