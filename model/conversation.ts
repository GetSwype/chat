import { PrismaClient, Conversation } from "@prisma/client"
import Storage from "./storage"
import { OpenAI } from "./openai";
import { IMessage } from "./imessage";


function ConversationExtension(prisma_conversation: PrismaClient['conversation'] = Storage.instance.conversation) {
    return Object.assign(prisma_conversation, {
        async continue(conversation_id: string, phone_number: string): Promise<void> {
            const messages = await Storage.instance.message.findMany({
                where: {
                    conversation_id: conversation_id
                },
                orderBy: {
                    created_at: "asc"
                }
            });
            
            if (messages.length > 10) {
                await Storage.instance.message.create({
                    data: {
                        text: "You'll need to share a contact with me to continue chatting! Head into your phone's contacts and share a contact with me who'd like to try out ChatGPT :) This helps keep the service free, and grow to new users",
                        author: "assistant",
                        conversation_id: conversation_id
                    }
                })
                let message = await Storage.instance.message.findFirst({
                    where: {
                        conversation_id: conversation_id
                    },
                    orderBy: {
                        created_at: "desc"
                    }
                })
                await IMessage.getInstance().send(message, phone_number);
                return
            }else {
                await OpenAI.getInstance().complete(messages, phone_number);
                const latest_message = await Storage.instance.message.findFirst({
                    where: {
                        conversation_id: conversation_id
                    },
                    orderBy: {
                        created_at: "desc"
                    }
                });
                if (latest_message) {
                    await IMessage.getInstance().send(latest_message, phone_number)
                }
                return
            }
        }
    });
}

let Conversations = ConversationExtension()

export { Conversations }