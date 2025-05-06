import { User } from "../../model/user";
import { Role } from "../../types/index";


test('given: valid values for user; when: user is created; then: user should be succesfully created', () => {
    const user = new User({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        age: 20,
        email: 'john.doe@ucll.com',
        password: 'password123',
        phoneNumber: '1234567890',
        personalNumber: 1,
        role: 'user' as Role,
        wallets: [],
        transactions: []
    });

    expect(user.getFirstName()).toBe('John');
    expect(user.getLastName()).toBe('Doe');
    expect(user.getAge()).toEqual(20);
    expect(user.getEmail()).toBe('john.doe@ucll.com');
    expect(user.getPassword()).toBe('password123');
    expect(user.getPhoneNumber()).toBe('1234567890');
    expect(user.getPersonalNumber()).toBe(1);
    expect(user.getRole()).toBe('user');
    expect(user.getWallets()).toEqual([]);
    expect(user.getTransactions()).toEqual([]);
});

test('given: missing firstName; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: '',
            lastName: 'Doe',
            age: 20,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing firstName');
});

test('given: missing lastName; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        const user = new User({
            id: 1,
            firstName: 'John',
            lastName: '',
            age: 20,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    }

    expect(createNewUser).toThrow('Invalid or missing lastName');
});

test('given: missing age; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: undefined as unknown as number,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing age');
});

test('given: age less than 16; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 15,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Age must be 16 or higher, or 119 or lower.');
});

test('given: age greater than 120; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 121,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Age must be 16 or higher, or 119 or lower.');
});

test('given: invalid email; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 20,
            email: 'invalid-email',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing email');
});

test('given: missing password; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 20,
            email: 'john.doe@ucll.com',
            password: '',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing password');
});

test('given: missing phoneNumber; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 20,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '',
            personalNumber: 1,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing phoneNumber');
});

test('given: missing personalNumber; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 20,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: undefined as unknown as number,
            role: 'user' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing personalNumber');
});

test('given: invalid role; when: user is validated; then: validation should fail', () => {
    const createNewUser = () => {
        new User({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            age: 20,
            email: 'john.doe@ucll.com',
            password: 'password123',
            phoneNumber: '1234567890',
            personalNumber: 1,
            role: 'invalid-role' as Role,
            wallets: [],
            transactions: []
        });
    };

    expect(createNewUser).toThrow('Invalid or missing role');
});

test('given: valid token; when: token is verified; then: payload should not contain sensitive data', () => {
  const token = generateToken({ id: 1, role: 'user' });
  const decoded = verifyToken(token);
  expect(decoded).toHaveProperty('id', 1);
  expect(decoded).toHaveProperty('role', 'user');
  expect(decoded).not.toHaveProperty('email'); // Ensure sensitive data is not included
});