import { useRouter } from 'next/router';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { User, Wallet } from '@types';
import Header from '@components/header';
import Footer from '@components/footer';
import walletService from '@services/WalletService';
import Link from 'next/link';

type Props = {
    users: User[];
};

const WalletDetails: React.FC<Props> = ({ users }: Props) => {
    const router = useRouter();
    const { id } = router.query;
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            const fetchDatapoint = async () => {
                setError('');
                try {
                    const response = await walletService.getWalletById(Number(id));
                    if (!response.ok) {
                        if (response.status === 401) {
                            setError('You are unauthorized to use this page');
                        }
                        setError(response.statusText);
                    } else {
                        const walletdata = await response.json();
                        console.log(walletdata);
                        setWallet(walletdata);
                    }
                } catch (err) {
                    setError('Failed to fetch wallet details');
                }
            };

            fetchDatapoint();
        }
    }, [id]);

    const formatDate = (date: string | Date | null) => {
        if (!date) return 'No date available';

        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString();
        }

        if (date instanceof Date) {
            return date.toLocaleDateString();
        }

        return date;
    };

    const handleBackClick = () => {
        router.push('/wallets');
    };

    return (
        <>
            <Head>
                <title>{wallet ? `${wallet.name} Details` : 'Wallet Details'}</title>
                <meta name="description" content="Datapoint Details Page" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="p-6 flex-grow flex flex-col items-center">
                    <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-6 flex flex-col">
                        {error && <div className="text-red-800 mb-4">{error}</div>}
                        {wallet ? (
                            <>
                                <h1 className="text-3xl font-bold text-center mb-4">
                                    {wallet.name}
                                </h1>
                                <div className="mb-4 p-1">
                                    <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                        Name
                                    </h2>
                                    <p className="text-left">{wallet.name}</p>
                                </div>
                                <div className="mb-4 p-1">
                                    <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                        Currency
                                    </h2>
                                    <p className="text-left">
                                        {wallet.currency || 'No currency available '}
                                    </p>
                                </div>
                                <div className="mb-4 p-1">
                                    <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                        Wallet Leader
                                    </h2>
                                    <p className="text-left">
                                        {wallet.leader || 'No leader available'}
                                    </p>
                                </div>
                                <div className="mb-4 p-1">
                                    <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                        Amount/Value
                                    </h2>
                                    <p className="text-left">
                                        {wallet.amount || 'No amount available'}
                                    </p>
                                </div>

                                <div className="mb-4 p-1">
                                    <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                        users
                                    </h2>
                                    {users.map((user) => (
                                        <tr key={user.id} onClick={() => {}} role="button">
                                            <td className="border px-4 py-2">{user.firstName}</td>
                                            <td className="border px-4 py-2">{user.lastName}</td>
                                            <td className='"border px-4 py-2"'>{user.role}</td>
                                            {/* <td className="border px-4 py-2">
                  <Link href={`/detailswallet/${encodeURIComponent(wallet.walletId)}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded">
                      Details
                    </button>
                  </Link>
                </td> */}
                                        </tr>
                                    ))}
                                </div>
                                {
                                    <div className="mb-4 p-1">
                                        <h2 className="text-xl font-semibold text-left mb-1 p-0 m-0">
                                            Last Verified
                                        </h2>
                                        <p className="text-left">
                                            {formatDate(wallet.creationDate)}
                                        </p>
                                    </div>
                                }

                                <button
                                    onClick={handleBackClick}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                                >
                                    Back to wallets
                                </button>
                            </>
                        ) : (
                            <div className="text-center">Loading datapoint details...</div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default WalletDetails;
