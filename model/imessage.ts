import Sendblue from 'sendblue-node'
import dotenv from 'dotenv'
import { Message } from '@prisma/client';

export class IMessage {

    private static _instance:IMessage = new IMessage();
    private _client: Sendblue;

    constructor() {
        dotenv.config()
        if(IMessage._instance){
            throw new Error("Error: Instantiation failed: Use IMessage.getInstance() instead of new.");
        }
        IMessage._instance = this;
        this._client = new Sendblue(process.env.SENDBLUE_API_KEY!, process.env.SENDBLUE_API_SECRET!, {});
    }

    public async send(message: Message, phone_number: string): Promise<void> {
        const response = await this._client.sendMessage({
            number: phone_number,
            content: message.text,
        })
    }

    public static getInstance():IMessage {
        return IMessage._instance;
    }
}
