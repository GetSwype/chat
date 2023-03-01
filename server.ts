import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Users } from './model/user';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;


app.post('/chat', (req: Request, res: Response) => {
    const {  } = req.body;
});

app.post('/register', (req: Request, res: Response) => {
    try {
        const { phone_number } = req.body;
        console.info("Registering user with phone number: " + phone_number);
        Users.signup({ phone_number })
    } catch (error) {
        
    }
    res.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});