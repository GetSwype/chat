import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const bodyParser = require('body-parser');
import { Users } from './model/user';
import { Conversations } from './model/conversation';
import { Messages } from './model/message';
import { extract_name_and_number } from './model/vcf';
import { IMessage } from './model/imessage';

dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


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
app.post('/chat', async (req: Request, res: Response) => {
    const { from_number, content, media_url } = req.body;
    console.log("Message: ", req.body)

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
        const conversation = user!.conversations[0];
        if (media_url.endsWith(".vcf")) {
            const { name, phone } = await extract_name_and_number(media_url);
            if (!name || !phone) {
                return res.status(400).json({ error: "Could not extract name and number from VCF file" });
            }
            await Users.signup({ phone_number: phone })
            await Messages.create({
                data: {
                    text: `I just shared you with ${name}! He will now be able to chat with you.`,
                    author: "user",
                    conversation_id: conversation.id
                }
            })
            await Conversations.continue(conversation.id, from_number)
            await Users.update({
                where: {
                    phone_number: from_number
                },
                data: {
                    has_shared: true
                }
            })
            return res.status(200).send("Added contact to database");
        } else {
            await Messages.create({
                data: {
                    text: content,
                    author: "user",
                    conversation_id: conversation.id
                }
            })
            await Conversations.continue(conversation.id, from_number)
            return res.status(200).json({ message: "Sent response to user" });
        }
    } catch (error) {
        console.error("An error occurred when attempting to continue a conversation: ", error);
        return res.status(400).json({ error: (error as any).message })
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ message: "Server is running" })
})

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

app.listen(port, async () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});