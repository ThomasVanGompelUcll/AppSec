import { FC, useEffect, useState } from 'react';
import { User } from '@types'; // Ensure this is correctly defined in your types
import styles from '@styles/userprofile.module.css';
import { useRouter } from 'next/router';
import Header from '@components/header';
import Footer from '@components/footer';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = sessionStorage.getItem('authToken'); // Get the JWT token

            if (!token) {
                // If no token, redirect to login or show error message
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
                        Authorization: `Bearer ${token}`, // Pass token in Authorization header
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch user details. Status code: ${response.status}`
                    );
                }

                const userDetails = await response.json();
                setUser(userDetails);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setErrorMessage('Failed to load user details. Please try again later.');
            }
        };

        fetchUserDetails();
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
                            User Profile
                        </h2>
                        <div className={styles.profileDetails}>
                            {user ? (
                                <>
                                    <p>
                                        <strong>First Name:</strong> {user.firstName}
                                    </p>
                                    <p>
                                        <strong>Last Name:</strong> {user.lastName}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <p>
                                        <strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}
                                    </p>
                                </>
                            ) : (
                                <p>No user is currently logged in. Log in to see your details.</p>
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
