import { User } from "../model/user";

// const users =  [];

test('given: valid value for user; when: user is created; then: user is created', () => {
    const phoneNumber = "0491327120";
    const first = "hagrid"
    const last = "broekmans"
    const email = "hagridbroek@gmail.nl"
    const validPassword = "testPassword";
    const role = "user";
    const users = [];
  
    const user = new User({phoneNumber : phoneNumber,firstName: first, lastName: last, email : email, password : validPassword, role : role });
    users.push(user);
    
    expect(user.phoneNumber).toEqual(phoneNumber);
    expect(user.firstName).toEqual(first);
    expect(user.lastName).toEqual(last);
    expect(user.email).toEqual(email);
    expect(user.getPassword()).toEqual(validPassword);
    expect(user.getRole()).toEqual(role);
    expect(user.getId()).toBeUndefined();
    expect(users).toContain(user)
  });

  test('given: invalid email; when: user is created; then: an error is thrown', () => {
    const phoneNumber = "0491327120";
    const first = "hagrid";
    const last = "broekmans";
    const invalidEmail = "invalid-email"; // Invalid email format
    const validPassword = "testPassword";
    const role = "user";
    
    expect(() => {
      new User({phoneNumber: phoneNumber, firstName: first, lastName: last, email: invalidEmail, password: validPassword, role: role
      });
    }).toThrowError("Invalid email format");

  });

  test('given: missing required fields; when: user is created; then: an error is thrown', () => {
    const phoneNumber = ""; // Missing phone number
    const first = "hagrid";
    const last = "broekmans";
    const email = "hagridbroek@gmail.nl";
    const validPassword = "testPassword";
    const role = "user";
  
    // Expecting the constructor to throw an error
    expect(() => {
      new User({
        phoneNumber: phoneNumber, // Missing required phone number
        firstName: first,
        lastName: last,
        email: email,
        password: validPassword,
        role: role,
      });
    }).toThrowError('Phone number cannot be empty');
  });
  
  // Test case 2: Invalid password (too short)
  test('given: invalid password; when: user is created; then: an error is thrown', () => {
    const phoneNumber = "0491327120";
    const first = "hagrid";
    const last = "broekmans";
    const email = "hagridbroek@gmail.nl";
    const invalidPassword = "123"; // Password too short
    const role = "user";
  
    // Expecting the constructor to throw an error
    expect(() => {
      new User({
        phoneNumber: phoneNumber,
        firstName: first,
        lastName: last,
        email: email,
        password: invalidPassword, // Invalid password
        role: role,
      });
    }).toThrowError('Password must be at least 6 characters');
  });
  
  