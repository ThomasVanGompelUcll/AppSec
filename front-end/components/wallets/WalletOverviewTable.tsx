import React, { useEffect, useState } from 'react';
import { Wallet } from '@types';
import Link from 'next/link';
import styles from '@styles/walletoverview.module.css'; // Import the new CSS module

type User = {
    id: string;
    name: string;
};

type Props = {
    wallets: Array<Wallet>;
    user: User;
};

const WalletOverviewTable: React.FC<Props> = ({ wallets }: Props) => {
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
            {wallets && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.headerCell}>Wallet Name</th>
                            <th className={styles.headerCell}>Amount</th>
                            {/* <th className={styles.headerCell}>Add/remove users</th> */}
                            <th className={styles.headerCell}>Add transaction</th>
                            <th className={styles.headerCell}>Add subscription</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wallets.map((wallet) => (
                            <tr key={wallet.walletId} className={styles.row}>
                                <td className={styles.cell}>{wallet.name}</td>
                                <td className={styles.cell}>{wallet.amount}</td>
                                {/* <td className={styles.cell}>
                                    <Link href="/users">
                                        <button
                                            className="text-white bg-[#F0F8FF] hover:bg-[#E0E8EF] font-medium rounded-lg text-sm px-5 py-2.5 text-center p-2"
                                            style={{ color: '#063f34' }}
                                        >
                                            Add/remove users
                                        </button>
                                    </Link>
                                </td> */}
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
