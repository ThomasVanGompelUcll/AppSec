import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './controller/user.routes';
import { walletRouter } from './controller/wallet.routes';
import { subscriptionRouter } from './controller/subscription.routes';
import { transactionRouter } from './controller/transaction.routes';
import { authRouter } from './controller/auth.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/wallets", walletRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/transactions", transactionRouter);
app.use("/", authRouter);


app.get('/status', (req, res) => {
    res.json({ message: 'Courses API is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Courses API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`Courses API is running on port ${port}.`);
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({ status: 'unauthorized', message: err.message });
//     } else if (err.name === 'CoursesError') {
//         res.status(400).json({ status: 'domain error', message: err.message });
//     } else {
//         res.status(400).json({ status: 'application error', message: err.message });
//     }
// });

