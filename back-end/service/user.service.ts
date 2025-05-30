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

  validatePassword(userInput.password);

  const existingUser = await userDb.userExists(userInput.email);
  if (existingUser) throw new Error('User with this email already exists');

  const newUser = await userDb.createUser(userInput);

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

const updateUserRole = async (userId: number, role: string) => {
  const user = await userDb.getUserById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  user.role = role;
  return await userDb.updateUser(user);
};

const validatePassword = (password: string): void => {
    const passwordPolicy = [
      { regex: /.{8,}/, message: 'Password must be at least 8 characters long' },
      { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
      { regex: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
      { regex: /[0-9]/, message: 'Password must contain at least one number' },
      { regex: /[@$!%*?&#]/, message: 'Password must contain at least one special character' },
    ];
  
    for (const rule of passwordPolicy) {
      if (!rule.regex.test(password)) {
        throw new Error(rule.message);
      }
    }
};

const deleteUser = async (userId: number): Promise<void> => {
    const user = await userDb.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    await userDb.deleteUser(userId);
  };

export default { getAllUsers, createUser, getUserById, findByEmail, updateUserRole, deleteUser };
