import Header from '@components/header';
import UsersOverviewTable from '@components/users/UserOverviewTable';
import { Transaction } from '@types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '@styles/home.module.css';
import Link from 'next/link';
import Footer from '@components/footer';

const Users: React.FC = () => {
    return (
        <>
            <Head>
                <title>Users</title>
                <meta name="description" content="View all your users" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={`${styles.main} flex-grow flex flex-col items-center`}>
                <section
                    className="flex flex-row justify-between items-center w-full"
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: '1px solid #ccc',
                    }}
                >
                    <h1>Users</h1>
                </section>
                <section className="w-full p-4">
                    <UsersOverviewTable />
                </section>
            </main>
            <Footer />
        </>
    );
};

export default Users;
