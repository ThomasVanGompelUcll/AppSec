import Head from 'next/head';
import Header from '@components/header';
import RegisterForm from '@components/register/RegisterForm';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
    const router = useRouter();

    const handleRegisterClick = () => {
        router.push('/register');
    };

    return (
        <>
            <Head>
                <title>User Register</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <RegisterForm />
                    <div className="mt-4 flex flex-col items-center">
                        <p className="text-sm text-gray-600">Don't have an account?</p>
                        <button
                            onClick={handleRegisterClick}
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                        >
                            Register
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Login;
