import React from 'react';
import { Transaction } from '@types';
import styles from '@styles/walletoverview.module.css'; // Reusing the existing CSS module

type Props = {
    transactions: Array<Transaction>;
};

const TransactionOverviewTable: React.FC<Props> = ({ transactions }: Props) => {
    return (
        <div className={styles.tableContainer}>
            {transactions && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.headerCell}>Transaction Name</th>
                            <th className={styles.headerCell}>Amount</th>
                            <th className={styles.headerCell}>Expense/Income</th>
                            <th className={styles.headerCell}>Date and Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id} className={styles.row}>
                                <td className={styles.cell}>{transaction.category}</td>
                                <td className={styles.cell}>
                                    {transaction.amount} {transaction.currency}
                                </td>
                                <td className={styles.cell}>
                                    {transaction.expense ? 'Expense' : 'Income'}
                                </td>
                                <td className={styles.cell}>
                                    {new Date(transaction.dateTime).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TransactionOverviewTable;
