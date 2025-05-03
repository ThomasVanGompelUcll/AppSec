import React from 'react';
import { SubscriptionInput } from '@types';
import styles from '@styles/walletoverview.module.css'; // Reusing the existing CSS module

type Props = {
    subscriptions: Array<SubscriptionInput>;
};

const SubscriptionOverviewTable: React.FC<Props> = ({ subscriptions }: Props) => {
    return (
        <div className={styles.tableContainer}>
            {subscriptions && (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.headerCell}>Description</th>
                            <th className={styles.headerCell}>Amount</th>
                            <th className={styles.headerCell}>Expense</th>
                            <th className={styles.headerCell}>Frequency</th>
                            <th className={styles.headerCell}>Start Date</th>
                            <th className={styles.headerCell}>End Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscriptions.map((subscription, index) => (
                            <tr key={index} className={styles.row}>
                                <td className={styles.cell}>{subscription.description}</td>
                                <td className={styles.cell}>
                                    {subscription.amount} {subscription.currency}
                                </td>
                                <td className={styles.cell}>
                                    {subscription.expense ? 'Yes' : 'No'}
                                </td>
                                <td className={styles.cell}>{subscription.frequency}</td>
                                <td className={styles.cell}>
                                    {new Date(subscription.startDate).toLocaleDateString()}
                                </td>
                                <td className={styles.cell}>
                                    {subscription.endDate
                                        ? new Date(subscription.endDate).toLocaleDateString()
                                        : 'N/A'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SubscriptionOverviewTable;
