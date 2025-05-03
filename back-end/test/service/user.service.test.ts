import { User } from '../../model/user';
import userDb from '../../repository/user.db';
import userService from '../../service/user.service';
import { Role } from '../../types';

// Mock Users
const mockUsers: User[] = [
    new User({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 20,
        email: 'john.doe@ucll.be',
        password: 'john123',
        phoneNumber: '1234567890',
        personalNumber: 1,
        role: 'user' as Role,
        wallets: [],
        transactions: []
    }),
    new User({
        id: 2,
        firstName: 'Jane',
        lastName: 'Doe',
        age: 20,
        email: 'jane.doe@ucll.be',
        password: 'jane123',
        phoneNumber: '0987654321',
        personalNumber: 2,
        role: 'user' as Role,
        wallets: [],
        transactions: []
    }),
];

// Mock functions
let mockUserDbGetAllUsers: jest.SpyInstance;
let mockUserDbGetUserById: jest.SpyInstance;

beforeEach(() => {
    jest.clearAllMocks();

    // Mock getAllUsers to return a Promise
    mockUserDbGetAllUsers = jest.spyOn(userDb, 'getAllUsers').mockResolvedValue(mockUsers);

    // Mock getUserById to return a Promise
    mockUserDbGetUserById = jest.spyOn(userDb, 'getUserById').mockImplementation(({ id }: { id: number }) => {
        return mockUsers.find(user => user.id === id) || null;
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given a valid request, when getAllUsers is called, then all users are returned', async () => {
    const users = await userService.getAllUsers();

    expect(users).toEqual(mockUsers);
    expect(mockUserDbGetAllUsers).toHaveBeenCalledTimes(1);
});

test('given a valid user id, when getUserById is called, then the user is returned', async () => {
    const userId = 1;
    const user = await userService.getUserById(userId);
    expect(user).toEqual(mockUsers[0]);
    expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: userId });  
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
});

test('given an invalid user id, when getUserById is called, then an error is thrown', async () => {
    const userId = 3;
    await expect(userService.getUserById(userId)).rejects.toThrow(`User with id ${userId} does not exist`);
    expect(mockUserDbGetUserById).toHaveBeenCalledWith({ id: userId });
    expect(mockUserDbGetUserById).toHaveBeenCalledTimes(1);
});
