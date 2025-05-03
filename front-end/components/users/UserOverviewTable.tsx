import React, { useEffect, useState } from 'react';
import { Wallet } from '@types';
import Link from 'next/link';
import styles from '@styles/walletoverview.module.css'; // Import the new CSS module

type User = {
    id: string;
    name: string;
};

const WalletOverviewTable: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Fetch the users from the API
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: User[] = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className={styles.tableContainer}>
            {users && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.headerCell}>User name</th>
                            <th className={styles.headerCell}>User last name</th>
                            <th className={styles.headerCell}>Usre age</th>
                            <th className={styles.headerCell}>Add transaction</th>
                            <th className={styles.headerCell}>Add subscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={styles.row}>
                                <td className={styles.cell}>{user.name}</td>
                                <td className={styles.cell}>{user.name}</td>
                                <td className={styles.cell}>
                                    <Link href="/transactions">
                                        <button
                                            className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                                            style={{ color: '#063f34' }}
                                        >
                                            Transactions
                                        </button>
                                    </Link>
                                </td>
                                <td className={styles.cell}>
                                    <Link href={`/addtransactions`}>
                                        <button
                                            className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                                            style={{ color: '#063f34' }}
                                        >
                                            Add Transaction
                                        </button>
                                    </Link>
                                </td>
                                <td className={styles.cell}>
                                    <Link href={`/addSubscription`}>
                                        <button
                                            className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                                            style={{ color: '#063f34' }}
                                        >
                                            Add Subscription
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default WalletOverviewTable;
