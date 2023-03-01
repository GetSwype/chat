import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const bodyParser = require('body-parser');
import { Users } from './model/user';
import { Conversations } from './model/conversation';
import { Messages } from './model/message';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3001;


// {
//     "accountEmail": "support@sendblue.co",
//     "content": "Ahoy Developer!",
//     "media_url": "some_cdn_link.png",
//     "is_outbound": false,
//     "status": "RECEIVED",
//     "error_code": null,
//     "error_message": null,
//     "message_handle": "xxxxx",
//     "date_sent": "2020-09-10T06:15:05.962Z",
//     "date_updated": "2020-09-10T06:15:05.962Z",
//     "from_number": "+19998887777",
//     "number": "+19998887777",
//     "to_number": "+15122164639",
//     "was_downgraded": false,
//     "plan": "blue"
// }
app.post('/chat', async(req: Request, res: Response) => {
    const { from_number, content, media_url } = req.body;
    try {
        const user = await Users.findUnique({
            where: {
                phone_number: from_number
            },
            include: {
                conversations: true
            }
        });
        if (!user) {
            res.status(400).json({ error: "User not found" });
        }
        await Messages.create({
            data: {
                text: content,
                author: "user",
                conversation_id: user!.conversations[0].id
            }
        })
        const conversation = user!.conversations[0];
        Conversations.continue(conversation.id, from_number)
        res.status(200).json({ message: "Sent response to user" });
    } catch(error) {
        console.error("An error occurred when attempting to continue a conversation: ", error);
        res.status(400).json({ error: (error as any).message })
    }
});

app.post('/register', async(req: Request, res: Response) => {
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