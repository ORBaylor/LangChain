import * as dotenv from 'dotenv'
dotenv.config();

import { OpenAI } from "langchain/llms/openai";
import {SerpAPI} from "langchain/tools";
import {Calculator} from "langchain/tools/calculator"
import {initializeAgentExecutorWithOptions} from "langchain/agents"

const model = new OpenAI({
    temperature: 0,

});

const tools = [

    new SerpAPI(process.env.SERPAPI_API_KEY, {
        h1: "en",
        gl: "us",
    }),

    new Calculator(),
]

// const executor = await initializeAgentExecutorWithOptions(tools, model, {
//     ageentType: "zero-shot-react-description"
// } )

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    //verbose is used for debugging the data that is given back.
    //verbose: true,
})

console.log("Loaded agent")

const res = await executor.call({
    input: "Who is Oliva Wilde's boyfriend? What is his current age raised to the 0.23 power?",
})

console.log(res.output);