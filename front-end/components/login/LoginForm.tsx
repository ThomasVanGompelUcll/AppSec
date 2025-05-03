import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

const LoginForm: React.FC = () => {
    let welcomeMessage = '';

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const clearErrors = () => {
        setEmailError(null);
        setPasswordError(null);
        setStatusMessage(null);
    };

    const validate = (): boolean => {
        let isValid = true;

        if (!email.trim()) {
            setEmailError('Email is required.');
            isValid = false;
        }
        if (!password.trim()) {
            setPasswordError('Password is required.');
            isValid = false;
        }

        console.log('Validation result:', isValid);
        return isValid;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        console.log('Starting form submission...');

        if (!validate()) {
            console.log('Validation failed.');
            return;
        }

        console.log('Validation passed. Sending login request...');
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Correct the request body
            });

            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to login. Status code: ${response.status}`);
            }

            const { token } = await response.json(); // Expect the token from the response

            if (!token) {
                console.log('No token returned. Login failed.');
                setStatusMessage('Email or password is incorrect.');
                return;
            }

            console.log('Login successful. Token:', token);

            // Store JWT token in sessionStorage (or localStorage)
            sessionStorage.setItem('authToken', token); // You can use localStorage too if you prefer

            // Redirect to a protected route, like '/wallets'
            setStatusMessage('Login successful! Redirecting...');
            setTimeout(() => router.push('/wallets'), 2000); // Redirect after 2 seconds
        } catch (error) {
            console.error('Error during login process:', error);
            setStatusMessage('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-center mb-4">Login</h3>
            {statusMessage && <p className="text-center text-green-600 mb-4">{statusMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {emailError && <p className="text-red-600 text-sm mt-1">{emailError}</p>}
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
