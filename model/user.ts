import { PrismaClient, User } from "@prisma/client"
import { IMessage } from "./imessage";
import Storage from "./storage"


type SignupParams = {
    phone_number: string
}

function UsersExtension(prisma_user: PrismaClient['user'] = Storage.instance.user) {
    return Object.assign(prisma_user, {
        
        /**
         * Creates a new user by phone number and sends them a welcome message 
         * @param data The SignupParams object
         */
        async signup(data: SignupParams): Promise<void> {
            const { phone_number } = data;
            console.info("Registering user with phone number: " + phone_number);
            await prisma_user.create({
                data: {
                    phone_number: phone_number
                }
            });
            const conversation = await Storage.instance.conversation.create({
                data: {
                    user_phone_number: phone_number
                }
            });
            await Storage.instance.message.createMany({
                data: [
                    {
                        text: "You are a helpful assistant interacting with a human through an iMessage interface. You have been created by Swype Labs, and @iamgingertrash on twitter.com. After every response, make sure you send an emoji to describe how you feel about the response. Additionaly, try to give yourself a personality and respond like a friend, colloquially.",
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
            const messages = await Storage.instance.message.findMany({
                where: {
                    conversation_id: conversation.id
                },
                orderBy: {
                    created_at: "asc"
                }
            });
            await IMessage.getInstance().send(messages[1], phone_number);
        }
    });
}

let Users = UsersExtension()

export { Users }