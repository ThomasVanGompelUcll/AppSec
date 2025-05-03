import { FC, useEffect, useState } from 'react';
import { User } from '@types'; // Ensure this is correctly defined in your types
import styles from '@styles/userprofile.module.css';
import userService from '@services/UserService'; // Ensure this service is implemented
import { useRouter } from 'next/router';
import Header from '@components/header';
import Footer from '@components/footer';

const UserProfile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserDetails = async () => {
            // Retrieve the logged-in user from sessionStorage
            const loggedInUser = sessionStorage.getItem('loggedInUser');

            if (!loggedInUser) {
                // No logged-in user; render the page without user details
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
            } catch (error) {
                console.error('Error fetching user details:', error);
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
