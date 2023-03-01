const { Configuration, OpenAIApi } = require("openai");
const { Messages } = require("./message");
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

    public async complete(messages: typeof Message[]): Promise<void> {
        const completion = await this._client.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messages.map((message) => { return Messages.parse(message) }),
        });
        console.log(completion.data.choices);
        await Messages.reverse_parse(completion.data.choices[0].message, messages[0].conversation_id);
    }
}