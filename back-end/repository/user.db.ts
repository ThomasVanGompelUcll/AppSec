import { PrismaClient } from '@prisma/client';
import { User } from '../model/user';
import { UserInput, Role } from '../types';
import database from './database'

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

const getUserByEmail = async (email: string): Promise<boolean> => {
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



export default {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
};