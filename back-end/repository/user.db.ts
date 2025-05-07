import { PrismaClient } from '@prisma/client';
import { User } from '../model/user';
import { UserInput, Role } from '../types';
import database from './database'
import { useReducer } from 'react';

// const prisma = new PrismaClient();

const getAllUsers = async() => {
    return await database.user.findMany({
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true,
        },
    });
}

const getUserById = async (userId: number) => {
    return await database.user.findUnique({
        where: { id: userId },
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true
        }
    });
};

const getUserByEmail = async (userEmail: string) => {
    if (!userEmail || typeof userEmail !== 'string') {
        throw new Error('Invalid email input');
    }

    return await database.user.findUnique({
        where: { email: userEmail }, // Parameterized query handled by Prisma
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true,
        },
    });
};

const createUser = async(user: UserInput) => {
    return await database.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            password: user.password,
            phoneNumber: user.phoneNumber,
            personalNumber: user.personalNumber,
            role: user.role,
            ownedWallets: {
                create: [],
            },
            sharedWallets: {
                create: [],
            },
            transactions: {
                create: [],
            },
        },
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true,
        },
    });
};

const userExists = async (email: string): Promise<Boolean> => {
    const user = await database.user.findUnique({
        where: { email },
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true
        }
    });
    return !!user;
};

const updateUser = async (user: { id: number; role: string }) => {
    return await database.user.update({
        where: { id: user.id },
        data: { role: user.role },
        include: {
            ownedWallets: true,
            sharedWallets: true,
            transactions: true,
        },
    });
};

export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    userExists,
    updateUser,
};