
//All things I need to import to use memory fuction of OpenAI and .env

import * as dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "langchain/llms/openai";
import {BufferMemory} from 'langchain/memory';
import {ConversationChain} from 'langchain/chains'


const model = new OpenAI({})

const memory = new BufferMemory()
const chain = new ConversationChain({
    llm: model,
    memory: memory,

})

const res1 = await chain.call({
    input: "Hi, I'm Omar."

})

const res2= await chain.call({
    input: "What is my name?"

})

console.log(res2);