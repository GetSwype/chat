import { PrismaClient, Conversation } from "@prisma/client"
import Storage from "./storage"
import { OpenAI } from "./openai";
import { IMessage } from "./imessage";
import { get_encoding, encoding_for_model } from "@dqbd/tiktoken";


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
        }
    });
}

let Conversations = ConversationExtension()

export { Conversations }