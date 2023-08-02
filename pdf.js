//import { Document } from "langchain/dist/document";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
//import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import * as dotenv from 'dotenv'
dotenv.config();
import axios from "axios"

//import {MapReduceDocumentsChain} from "langchain"


//const PDFLoader = require("langchain/document_loaders/fs/pdf")
//const embeddings = new OpenAIEmbeddings();

const loader = new PDFLoader("/Users/conerdev/Downloads/tesla_invoice5b6a6468-73df-4fc9-952e-73efee94e6e0.pdf");
const docs = await loader.load()

async function returnEmnedding(query) {

   

    const data = {
        input: query,
        model: "text-embedding-ada-002"
    }

    const headers = {
        'Authorization': [`Bearer ${process.env.OPENAI_API_KEY}`],
        'Content-Type': ['application/json']
    }

    const url = 'https://api.openai.com/v1/embeddings'

    try {

        const response = await axios.post(url, data, {headers})
        //const responseData = JSON.stringify(response.body.text())
      //console.log('Response:', response.data.data[0].embedding)
      if(response.status === 200){
        const embedding = response.data.data[0].embedding
      
      // findSimilarDocuments(embedding);
      // return embedding
       //findSimilar(embedding);
        console.log('This is the Embddeing results',embedding);

        //return embedding;
 
      }else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
       
       

    } catch (error) {
        console.error('Error', error)
    }


}


//Text splitting/Chunking
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 1,
})

let query = "This is a test"
//returnEmnedding(query);

const output = await splitter.createDocuments(docs.toString());

// for(let i = 0; i < output.length; i++){
//     let res = await returnEmnedding(output[i]);
//     console.log(res);
// }
// const docOutput = await splitter.splitDocuments([
//     new Document({pageContent: loader})
// ])

// console.log(output[0].metadata);
// console.log(output[0].pageContent);
// console.log(output);
returnEmnedding(output.toString());
//console.log(docOutput);

