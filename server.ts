import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { Users } from './model/user';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;


app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" })
})


app.post('/chat', async (req: Request, res: Response) => {
    const { } = req.body;
});

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { phone_number } = req.body;
        await Users.signup({ phone_number })
        res.status(200).json({ message: "User registered successfully" })
    } catch (error) {
        console.error("An error occurred when attempting to register a user: ", error);
        res.status(400).json({ error: (error as any).message })
    }
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});