const { Configuration, OpenAIApi } = require("openai");
import { Messages } from "./message";
const { Message } = require("@prisma/client");
import dotenv from 'dotenv'


export class OpenAI {

    private static _instance:OpenAI = new OpenAI();
    private _client: typeof OpenAIApi;

    constructor() {
        dotenv.config()
        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        this._client = new OpenAIApi(configuration);
    }

    public static getInstance(): OpenAI {
        return OpenAI._instance;
    }

    /**
     * Takes an array of messages and gets a completion from OpenAI. Also stores the completion in the database.
     * @param messages An array of messages passed as context
     */
    public async complete(messages: typeof Message[], phone_number: string): Promise<string> {
        const completion = await this._client.createChatCompletion({
            model: "gpt-3.5-turbo-0301",
            messages: messages.map((message) => { return Messages.parse(message) }),
            user: phone_number
        });
        console.log("Completion: ", completion.data.choices);
        await Messages.reverse_parse(completion.data.choices[0].message, messages[0].conversation_id);
        return completion.data.choices[0].text;
    }
}