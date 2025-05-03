import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

type Role = 'admin' | 'user'; // Adjust according to your role options

type UserInput = {
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    phoneNumber: string;
    personalNumber: number;
    role: Role;
};

const RegisterForm: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({
        firstName: '',
        lastName: '',
        age: 0,
        email: '',
        password: '',
        phoneNumber: '',
        personalNumber: 0,
        role: 'user',
    });
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});
    const router = useRouter();

    const clearErrors = () => {
        setErrors({});
        setStatusMessage(null);
    };

    // const validate = (): boolean => {
    //     const newErrors: Partial<Record<keyof UserInput, string>> = {};
    //     if (!userInput.firstName.trim()) newErrors.firstName = 'First name is required.';
    //     if (!userInput.lastName.trim()) newErrors.lastName = 'Last name is required.';
    //     if (!userInput.age || userInput.age <= 0) newErrors.age = 'Valid age is required.';
    //     if (!userInput.email.trim()) newErrors.email = 'Email is required.';
    //     if (!userInput.password.trim() || userInput.password.length < 6)
    //         newErrors.password = 'Password must be at least 6 characters.';
    //     if (!userInput.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required.';
    //     if (!userInput.personalNumber || userInput.personalNumber <= 0)
    //         newErrors.personalNumber = 'Valid personal number is required.';
    //     setErrors(newErrors);

    //     return Object.keys(newErrors).length === 0;
    // };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInput((prev) => ({
            ...prev,
            [name]: name === 'age' || name === 'personalNumber' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearErrors();

        // if (!validate()) {
        //     return;
        // }

        try {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userInput),
            });

            if (!response.ok) {
                throw new Error(`Failed to register user. Status: ${response.status}`);
            }

            setStatusMessage('Registration successful! Redirecting to login...');
            setTimeout(() => router.push('/wallets'), 2000);
        } catch (error) {
            console.error('Error during registration:', error);
            setStatusMessage('An error occurred while registering. Please try again later.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-center mb-4">Register</h3>
            {statusMessage && <p className="text-center text-green-600 mb-4">{statusMessage}</p>}
            <form onSubmit={handleSubmit}>
                {[
                    { label: 'First Name', name: 'firstName', type: 'text' },
                    { label: 'Last Name', name: 'lastName', type: 'text' },
                    { label: 'Age', name: 'age', type: 'number' },
                    { label: 'Email', name: 'email', type: 'email' },
                    { label: 'Password', name: 'password', type: 'password' },
                    { label: 'Phone Number', name: 'phoneNumber', type: 'text' },
                    { label: 'Personal Number', name: 'personalNumber', type: 'number' },
                ].map(({ label, name, type }) => (
                    <div key={name} className="mb-4">
                        <label htmlFor={name} className="block text-sm font-medium mb-2">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            value={(userInput as any)[name]}
                            onChange={handleInputChange}
                            className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors[name as keyof UserInput] && (
                            <p className="text-red-600 text-sm mt-1">
                                {errors[name as keyof UserInput]}
                            </p>
                        )}
                    </div>
                ))}
                <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium mb-2">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        value={userInput.role}
                        onChange={handleInputChange}
                        className="block w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
