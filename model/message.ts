import { PrismaClient, Message } from "@prisma/client"
import Storage from "./storage"
import { OpenAIFormat } from "./types"

function MessagesExtension(prisma_message: PrismaClient['message'] = Storage.instance.message) {
    return Object.assign(prisma_message, {
        parse(message: Message): OpenAIFormat  {
            return {
                role: message.author,
                content: message.text,
            }
        },

        async reverse_parse(message: OpenAIFormat, conversation_id: string) {
            await prisma_message.create({
                data: {
                    text: message.content,
                    author: message.role,
                    conversation_id: conversation_id
                }
            })
        }
    });
}

let Messages = MessagesExtension()

export { Messages }