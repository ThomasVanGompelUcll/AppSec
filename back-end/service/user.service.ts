import { User } from '../model/user';
import userDb from '../repository/user.db';
import { UserInput } from '../types';
import bcrypt from 'bcrypt';

const SALT_ROUNDS =10;

const getAllUsers = async() => {
    const users = await userDb.getAllUsers();
    return users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        password: user.password,
        role: user.role,
        wallets: {
            owned: user.ownedWallets,
            shared: user.sharedWallets,
        },
        transactions: user.transactions,
    }));
}

const getUserById = async(userId: number) => {
    const user = await userDb.getUserById(userId);
    return user;
}

const findByEmail = async (userEmail: string) => {
    if (!userEmail || typeof userEmail !== 'string') {
        throw new Error('Invalid email input');
    }

    if (await userDb.userExists(userEmail)) {
        const user = await userDb.getUserByEmail(userEmail);
        return user;
    }
    return null;
};

const createUser = async (userInput: UserInput): Promise<User> => {
    if (!userInput.email || typeof userInput.email !== 'string') {
        throw new Error('Email is required and must be a string');
    }

    // Check if the user already exists
    const existingUser = await userDb.userExists(userInput.email);
    if (existingUser) throw new Error('User with this email already exists');

    // Hash the password
    const hashedPassword = await bcrypt.hash(userInput.password, SALT_ROUNDS);

    // Replace the plain password with the hashed password
    const userToSave = { ...userInput, password: hashedPassword };

    // Save the user to the database
    const newUser = await userDb.createUser(userToSave);

    // Format the result to include owned and shared wallets
    const result = {
        ...newUser,
        wallets: {
            owned: newUser.ownedWallets.map(wallet => ({
                id: wallet.id,
                currency: wallet.currency,
                creationDate: wallet.creationDate,
                amount: wallet.amount,
                ownerId: wallet.ownerId,
            })),
            shared: newUser.sharedWallets.map(wallet => ({
                id: wallet.id,
                currency: wallet.currency,
                creationDate: wallet.creationDate,
                amount: wallet.amount,
                ownerId: wallet.ownerId,
            })),
        },
    };

    return result as any;
};

export default { getAllUsers, createUser, getUserById, findByEmail };
