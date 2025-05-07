# Report

- Full Name: Van Gompel Thomas
- Student Number: R0942966
- Full Name of person you made your full stack project with: Harold Frenay
- Student Number of person you made your full stack project with: r1001772
- Brief description of your project and the technologies used for front- and back-end:

## Description

We made a budget application, where you can track your expenses and income. There i also a possibilty of sharing a wallet with other users for events or group activities etc. We also made a subscription option for income or expenses.

## Front-End Tools and Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- Bootstrap
- SWR
- React Datepicker
- i18next

## Back-End Tools and Technologies

- Node.js
- Express.js
- Prisma
- PostgreSQL
- Helmet
- Swagger
- Jest
- Dotenv

## Database and ORM

- Prisma Schema
- PostgreSQL

## Testing and Configuration

- Jest
- Prettier
- TypeScript Config (tsconfig.json)

# Cryptography

## Before

There is no cryptography. We did not finish our project at all so we didn't get to this point.

## After

I didn't really have any security measures so this is what i added:

- JWT
  - Tokes validated using middleware, so routers are protected and they have input validation.
  - Secrets generated and stored in AWS. Tokens ahve expiration and invlaid tokes are blocked.
  - Refresh handling and authentication.
- Passwords
  - passwords are hased and salted using bcrypt.
- Secrets
  - Secrets are stored in my .env file
- Input validation
  - Input validation to prevent injection

## Code Examples

- user.routes.ts -> 130 uses JWT middleware to validate tokens along with input validation
- subscription.routes.ts -> 78 uses JWT middleware to validate tokens along with input validation
- transaction.routes.ts -> 228 uses JWT middleware to validate tokens along with input validation
- key_management.py: strong secret generation and storage in AWS, JWT toke creation, expiration, validation and protection against invalid or expired tokens.
- .env: secrets
- jwt.ts: JWT function implementations
- auth.ts: JWT middleware that verifies tokens, and restrics acces to protected routes.
- auth.routes.ts: JWT athentication with token generation, refrash handeling, input valitdation and password hashing
- user.service.ts -> 40: used bcrypt to (salted) hash passwords

# Injections

## Before

We used prisma, and this uses parameterized queries. This means sql injection attacks are already mitigated.

## After

- kept in your project
  - parameterized queries
  - no JSON.parse, this could lead to NoSQL injection
- changed in your project
- prevent sql injection
  - using zod to validate input in my api routes.
  - Don't give privilages to users in the database.
- prevent XSS
  - sanitizing and encoding the user generated content, backend and frontend
  - use a cps header

## Code Examples

- zod validation
  - Done in all routes.ts
  - example: auth.routes.ts -> 10 & 15
- least privilages

  - Queries are in .env (commented) -> 7-18

- sanitzing user generated content
  - done in all the index.tsx files
    - example: LoginForm.tsx -> 83
  - done in all routes.ts files
    - example: auth.routes.ts -> 55 & 103
- cps header: app.ts -> 21

# Class 04 Vulnerable & Outdated components

## SBOM & Dependency Check

Describe in a few sentences how you generated you SBOM, incl. the tools you used and the issues you encountered.
Describe in a few sentences how you checked if you used vulnerable dependencies.

## Vulnerabilities

List here the vulnerabilities you have found in direct dependencies or transitive dependencies.
Refer to the SBOM in appendix (don't put it in here).

## Vulnerabilities - Updated

What vulnerabilities were you able to mitigate (by upgrading) and why did you choose to do so?
What vulnerabilities did you keep (and why)?

# Class 05/06/07 - Authentication, Session Management & Authorization

(guideline: max 2 A4 pages, images/code snippets not counted)
Describe each of the following functionalities in your application AS IS:

- user registration & user removal
- user authentication
- password forgotten
- change password
- session management (Stateful or Stateless, how session information is being created, stored and transferred, where do you access it, where do you verify it, how do you terminate it, ...). Also include screenshot(s) of the whole cookie/token/header (so I can clearly see all properties and the value).
- access control (what roles, permissions, ... do you have and how and where do you check them, but also do you enable CORS and/or CSP and/or CSRF and how did you configure it)

For the functionalities you did not have yet, implement them. Or if not feasible, describe how you would implement them but why it's not feasible for you. When evaluating this, based on what we saw in class, did you improve your functionalities or code? If so, please explain what you changed and why.

How did you test/check for vulnerabilities?
Were you able to perform any kind of session attack or access control on your application?

# Class 08 - Secure CI/CD & Supply Chain

## Project for this course

To what phase in the CI/CD cycle did your application go and what threats could you possibly identify (categorize per SLSA item)?
Were you able to mitigate one of them?
If yes, explain how you did it.
If not, why was it impossible to mitigate?

## Project for the SE course

Did you follow the SE topic already or are you following it in parallel? If yes, can you identify possible threats in that project?
Were you able to mitigate one of them?
If yes, explain how you did it.
If not, why was it impossible to mitigate?

# Class 09 SSRF

Does your application process user controlled URL's? If yes, would an SSRF attack be possible? Were you able to mitigate this risk, and how? (max. 10 lines)

# Class 09 Logging & Monitoring

Evaluate the 7 sacred rules against your application. What logging framework do you use or did you implement on top?
Can you provide me with a valuable snippet of the logging for a 5 minute use of the application?

(max. 10 lines + print screen of log)

# Class 09 SAST

What SAST Tool did you install in your IDE?

What errors did you get (copy paste the basic error messages)?

What errors were you able to fix, and how? (max 3 lines per fix)

# Class 09 DAST

Launch ZAP egainst your application. First not authenticated, then in a second scan being authenticated.

Export each result to a report and add to appendix.

What errors were you able to fix, and how? (max 3 lines per fix)

# Class 10 topic

# Conclusion

Write a conclusion (most important thing you changed and learned) and identify at least one example (per security principle) of how you implemented the security principles.

# Appendix

## Tools used

Mention here all the tools/libraries you used for improving the security.
Provide me below with both pentest reports from ZAP:

### ZAP Test (non authenticated)

### ZAP Test (authenticated)

## Vulnerabilities discovered

Put here the full list of CVE's you found that were applicable to your code (or the libraries you used)

### SBOM

Put here your SBOM file.

## Most interesting conversation with a GenAI tool

Here, I expect you to copy paste a full transcript of the most interesting conversation you had with a genAI tool (also mention which one and what version).
