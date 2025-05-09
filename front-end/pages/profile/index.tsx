import { FC, useEffect, useState } from 'react';
import styles from '@styles/userprofile.module.css';
import { useRouter } from 'next/router';
import Header from '@components/header';
import Footer from '@components/footer';
import DOMPurify from 'dompurify';

const UserProfile: FC = () => {
    const [user, setUser] = useState<any | null>(null);
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
    }, []);

    return (
        <>
            <Header />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <div className={styles.container}>
                    <div className={styles.profile}>
                        <h2
                            className={styles.profileHeader}
                            style={{ textDecoration: 'underline' }}
                        >
                            Profile
                        </h2>
                        <div className={styles.profileDetails}>
                            {user ? (
                                <div>
                                    <p>
                                        <strong>Name:</strong> {user.firstName} {user.lastName}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Role:</strong> {user.role}
                                    </p>
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
