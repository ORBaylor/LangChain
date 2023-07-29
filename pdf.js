import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
//import {MapReduceDocumentsChain} from "langchain"


//const PDFLoader = require("langchain/document_loaders/fs/pdf")

const loader = new PDFLoader("/Users/conerdev/Downloads/tesla_invoice5b6a6468-73df-4fc9-952e-73efee94e6e0.pdf");
const docs = await loader.load()

//Text splitting/Chunking
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 1,
})



const output = await splitter.createDocuments(docs.toString())

console.log(output[0]);

