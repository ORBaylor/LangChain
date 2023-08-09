//import { Document } from "langchain/dist/document";
import {PDFLoader} from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
//import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import * as dotenv from 'dotenv'
dotenv.config();
import axios from "axios"
import { MongoClient, ServerApiVersion} from "mongodb"
//const axios = require('axios'); 

//const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://obaylor92:${process.env.MONGODB_PASSWORD}@cluster0.s0cmppe.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//import {MapReduceDocumentsChain} from "langchain"


//const PDFLoader = require("langchain/document_loaders/fs/pdf")
//const embeddings = new OpenAIEmbeddings();



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
       // console.log('This is the Embddeing results',embedding);
        findSimilarDocuments(embedding);

        //return embedding;
 
      }else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
       
       

    } catch (error) {
        console.error('Error', error)
    }


}

//const doc = Document(loader)



let query = "This is a test"

//returnEmnedding(query);

//const output = await splitter.createDocuments(docs.toString());
//const output2 = await splitter.transformDocuments(docs);



// console.log(output[0].pageContent.toString());
// console.log(output[1].metadata.loc.linesß);
// console.log(output[2]);
// console.log(output[2][0]);


// for(let i = 0; i < output2.toString().length; i++){
//     //onsole.log(output2[i].pageContent);
//     const res = await returnEmnedding(output2[i].pageContent)
//     console.log(`this is the emdedding for ${output2[i].pageContent} `, res)
// }


// const docOutput = await splitter.splitDocuments([
//     new Document({pageContent: loader})
// ])

// console.log(output[0].metadata);
// console.log(output[0].pageContent);
// console.log(output);
//returnEmnedding(output.toString());
//console.log(docOutput);
async function findSimilarDocuments(embedding){

    //console.log("Got inside the method 1");
    let similarDocuments = [];
    //console.log('Similar',similarDocuments);
    try {
            
       
        


            const url= 'https://us-east-1.aws.data.mongodb-api.com/app/data-eccpa/endpoint/data/v1/action/aggregate'
            const data = {
                collection:"PDFEmbeddings",
                database:"ChatPDF",
                dataSource:"Cluster0",
                pipeline: [
            
                    {
                        "$search": {
                            "index": "default",
                            "knnBeta": {
                            "vector": embedding,
                            "path": "plot_embedding",
                            "k": 1
                            }
                            }
                    }
                ]
            }
            const headers = {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': `${process.env.MONGO_ATLAS_PASSWORD}`,
              }
              
              
            const response = await axios.post(url, data, {headers})
            
            // console.log('New Axios methods',response.data.documents);
             

             similarDocuments = response.data.documents;
             console.log('Similar',similarDocuments);
                //return similarDocuments
    } catch (error) {
        
    }



}


async function insertOneThing(query){
    const loader = new PDFLoader("/Users/conerdev/Downloads/tesla_invoice5b6a6468-73df-4fc9-952e-73efee94e6e0.pdf");
    const docs = await loader.load();
    //Text splitting/Chunking
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 10,
        chunkOverlap: 1,
        })
    let docArray = '';
    const output =  await splitter.transformDocuments(docs);
       // const  outputReplaceArray = output.replace(")", " ")
       output.forEach( (out)=>{
            docArray +=out.pageContent
           
       })
       const replacedDocArray = docArray.replace((";", ""), ("(", " "), (")", " "))
      // console.log(replacedDocArray);
           //console.log("Output:", output[7].pageContent);
       //    console.log("outputReplaceArray:", outputReplaceArray);

   

    const usersCollection = client.db('ChatPDF').collection('PDFEmbeddings');
   
    



    const testDoc = {
        PdfName: `${query}`,
        PDF_Document: `${replacedDocArray}`,
    }

    try{
       
        
        
       const result = await usersCollection.insertOne(testDoc)
       console.log('Inserted document ID:', result.insertedId);
       const findResults = await usersCollection.find( )
          // console.log(findResults)

       await findResults.forEach(async element => {
        //console.log(element._id.toString().substring(15,30));
        if(result.insertedId.toString().substring(15,30) == element._id.toString().substring(15,30)){
         //   console.log(element.PDF_Document);
           // embeddingLoader = element.PDF_Document.lo;
            //const PDFdocs = new PDFLoader(element.PDF_Document).load();

           
           
//-----------------------------------------------Insert Embeddings--
         const data = {
            input: element.PDF_Document,
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
       console.log('Response:', response.data.data[0].embedding)
       const embedding = response.data.data[0].embedding
        await client.connect()
       const updateResult = await usersCollection.updateOne(
            {_id: result.insertedId},
            { $set: { plot_embedding: embedding }}
    
       )
        
       if(updateResult.modifiedCount===1){
        console.log("Successfully updated the document.");
       }else{
        console.log("Failed to update the document.");
       }
       await client.close()
           //--
    } catch (error) {
        throw new Error("THis is the error:", error.message)
    }
       

        }
        // console.log(element._id);
        // console.log(element.name);
       });

//-----------------------------------------//

      

   //console.log('This is the Embddeing results',embedding);
   client.close();
       
    }catch (err){
        console.error('Error inserting document:', err);
    }

  

    
}

//insertOneThing("Tesla Doc")
//findSimilarDocuments("Tesla")
returnEmnedding("tesla");
