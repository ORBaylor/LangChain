

import {ChatOpenAI} from "langchain/chat_models/openai";
import  {SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate, MessagesPlaceholder} from 'langchain/prompts'
import { LLMChain } from "langchain";
import {SerpAPI} from "langchain/tools"
import {ChatAgent, AgentExecutor} from "langchain/agents"
//Just like using an LLM but this time it will store the history 
import {ConversationChain} from "langchain/chains"
import {BufferMemory} from "langchain/memory"

import { HumanChatMessage, HumanMessage } from "langchain/schema";

//import {HumanMessage, SystemMessage} from "langchain/schema";
import * as dotenv from 'dotenv'
dotenv.config();


const model = new ChatOpenAI({
    streaming: true,
    callbacks: [
        {
            handleLLMNewToken(token){
                process.stdout.write(token)
            }
        }
    ]
})

const res = await model.call([
    new HumanMessage("Write a song about sparkling water.")
])

const tools = [

    new SerpAPI(process.env.SERPAPI_API_KEY, {
        h1: "en",
        gl: "us",
    }),
]

// const model = new ChatOpenAI({
//     temperature: 0,
//     //modelName: "gpt-3.5-turbo"


// })
//USING A CHAT AGENT TO ANSWER A QUESTION 

//const agent = ChatAgent.fromLLMAndTools(model, tools)

//The executor calls the SerpApi until a result is found 
// const executor = AgentExecutor.fromAgentAndTools({
//     agent: agent,
//     tools: tools,
// })

//const res = await executor.run("How many people live in the us in 2023?")
//console.log(res);
 
const chatPrompt =  ChatPromptTemplate.fromPromptMessages([
    //Telling the model how to behave 
    //Priming the AI Model
    SystemMessagePromptTemplate.fromTemplate("The following is a friendly conversation betweem a human an AI. The AI is  talkative and provides lots of specific details from it's context. If the AI does not know the answer to a question, it truthfully says it does not know   "),
    //Allowing the AI to read chat history
    new MessagesPlaceholder("history"),
    //This is the human response 
    HumanMessagePromptTemplate.fromTemplate("{input}"),

])


const chain = new ConversationChain(
    {
        memory: new BufferMemory({
            returnMessages: true, 
            memoryKey: "history"
        }),
        prompt: chatPrompt,
        llm: model
    }
)

// const res = await chain.call({
//     input: "Hello from New Jersey!"
// })

//console.log(res)


// const res2 = await chain.call({
//     input: "Do you know where I am?"
// })

// console.log(res2)
// const translationPromt =  ChatPromptTemplate.fromPromptMessages([
//     //Telling the model how to behave 
//     SystemMessagePromptTemplate.fromTemplate("You are a helpful assistant that translate {input_lang} to {output_lang}. "
//     ),
//     HumanMessagePromptTemplate.fromTemplate("{text}"),

// ])
//NOT NEEDED
// const formatedPrompt = await translationPromt.formatPromptValue({
//     input_lang: "english",
//     output_lang: "japanese",
//     text: "I love you"
// })

//console.log(formatedPrompt.messages);

//USING AN LLM TO TRANSLATE SOMETHING FOR THE USER 
// const chain = new LLMChain({
//     prompt: translationPromt,
//     llm: model
// })

// const res = await chain.call({
//     input_lang: "english",
//     output_lang: "japanese",
//     text: "I love you"
// })

// console.log(res)

// const res = await model.generatePrompt([formatedPrompt]);

// console.log(res.generations);



// const res = await model.generate([
//    [
//     new SystemMessage(
//         "Translate this sentence from English to Japanese. Where is the weed."
//     ),
//     new HumanMessage(
//         "Translate this sentence from English to Japanese. Where is the weed."
//     )
//    ],
//    [
//     new SystemMessage(
//         "Translate this sentence from English to spanish. Where is the weed ."
//     ),
//     new HumanMessage(
//         "Translate this sentence from English to spanish. Where is the weed."
//     )
//    ]
// ]);

// console.log(res.generations);