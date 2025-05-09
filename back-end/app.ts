// src/app.ts
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { userRouter } from './controller/user.routes';
import { walletRouter } from './controller/wallet.routes';
import { subscriptionRouter } from './controller/subscription.routes';
import { transactionRouter } from './controller/transaction.routes';
import { authRouter } from './controller/auth.routes';
import { ensureSecrets } from './util/jwt';

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3000;

(async () => {
    try {
        await ensureSecrets();

        app.use((req, res, next) => {
            if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
                return res.redirect('https://' + req.headers.host + req.url);
            }
            next();
        });

        app.use(helmet());
        app.use(bodyParser.json());
        app.use(cookieParser());

        app.use(cors({
            origin: 'http://localhost:8084',
            credentials: true,
        }));

        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Credentials', 'true');
            next();
        });

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

        app.listen(port, () => {
            console.log(`Courses API is running on port ${port}.`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();
