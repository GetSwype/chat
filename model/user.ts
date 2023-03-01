import { PrismaClient, User } from "@prisma/client"
import { IMessage } from "./imessage";
import Storage from "./storage"


type SignupParams = {
    phone_number: string
}

function UsersExtension(prisma_user: PrismaClient['user'] = Storage.instance.user) {
    return Object.assign(prisma_user, {
        async signup(data: SignupParams): Promise<string | User> {
            const { phone_number } = data;
            console.info("Registering user with phone number: " + phone_number);
            const user = await prisma_user.create({
                data: {
                    phone_number: phone_number
                }
            });
            const conversation = await Storage.instance.conversation.create({
                data: {
                    user_phone_number: phone_number
                }
            });
            const messages = await Storage.instance.message.createMany({
                data: [
                    {
                        text: "Hey there! I'm ChatGPT's assistant for iMessage. I can help you with anything you need ☺️",
                        author: "system",
                        conversation_id: conversation.id
                    },
                    {
                        text: "Hey there! I'm ChatGPT's assistant for iMessage. I can help you with anything you need ☺️",
                        author: "assistant",
                        conversation_id: conversation.id
                    }
                ]
            })
            IMessage.getInstance().send(messages[1], phone_number);
        }
    });
}

let Users = UsersExtension()

export { Users }