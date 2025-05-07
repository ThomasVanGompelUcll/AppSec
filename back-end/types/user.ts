export interface User {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    email: string;
    password: string;
    phoneNumber: string;
    personalNumber: number;
    role: string;
    mfaSecret?: string; // Added mfaSecret as an optional property
}
