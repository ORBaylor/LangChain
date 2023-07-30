//import * as dotenv from 'dotenv'
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

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



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
     //  findSimilarDocuments(response.data.data[0].embedding);
      if(response.status === 200){
        const embedding = response.data.data[0].embedding
      findSimilarDocuments(embedding)
       
      return embedding
       //findSimilar(embedding);
        //console.log('This is the Embddeing results',embedding);

        //return embedding;
 
      }else {
        throw new Error(`Failed to get embedding. Status code: ${response.status}`);
    }
       
       

    } catch (error) {
        console.error('Error', error)
    }


}
 
 



async function insertOneThing(){
    const usersCollection = client.db('Cluster0').collection('pdf');
    //const usersCollection = client.db.
    
    const testDoc = {
        name: "The really big test "
    }

    try{
       
        let embeddingText = '';
       const result = await usersCollection.insertOne(testDoc)
       console.log('Inserted document ID:', result.insertedId);
       const findResults = await usersCollection.find( )
          // console.log(findResults)

       await findResults.forEach(element => {
        //console.log(element._id.toString().substring(15,30));
        if(result.insertedId.toString().substring(15,30) == element._id.toString().substring(15,30)){
            console.log(element._id);
            embeddingText = element.name;
        }
        // console.log(element._id);
        // console.log(element.name);
       });
       //-----------------------------------------//

       const data = {
        input: embeddingText,
        model: "text-embedding-ada-002"
    }

    const headers = {
        'Authorization': [`Bearer ${process.env.OPENAI_API_KEY}`],
        'Content-Type': ['application/json']
    }

    const url = 'https://api.openai.com/v1/embeddings'

    const response = await axios.post(url, data, {headers})
    //const responseData = JSON.stringify(response.body.text())
  // console.log('Response:', response.data.data[0].embedding)
   const embedding = response.data.data[0].embedding

   const updateResult = await usersCollection.updateOne(
        {_id: result.insertedId},
        { $set: { plot_embedding: embedding }}

   )
    
   if(updateResult.modifiedCount===1){
    console.log("Successfully updated the document.");
   }else{
    console.log("Failed to update the document.");
   }

   //console.log('This is the Embddeing results',embedding);
   client.close();
       
    }catch (err){
        console.error('Error inserting document:', err);
    }

  

    
}

//insertOneThing()

async function findSimilarDocuments(embedding){

    console.log("Got inside the method 1");
    let similarDocuments = [];
    try {
            
       


            const url= 'https://us-east-1.aws.data.mongodb-api.com/app/data-eccpa/endpoint/data/v1/action/aggregate'
            const data = {
                collection:"pdf",
                database:"Cluster0",
                dataSource:"Cluster0",
                pipeline: [
            
                    {
                        "$search": {
                            "index": "default",
                            "knnBeta": {
                            "vector": embedding,
                            "path": "plot_embedding",
                            "k": 5
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
             console.log(response.data);

             if(response.status === 200){
                console.log('New Axios methods embeddings',response.data);
                similarDocuments = response.data;
                return similarDocuments;
             }

    } catch (error) {
        
    }



}



async function main(query){
    
   const newquery = query.toLowerCase()
   let document =[]

    try {
        const embedding = await returnEmnedding(newquery);
        //console.log('This is the main function embdedding: ',embedding)
         document = await findSimilarDocuments(embedding);

       console.log('This is the main function document: ',document)

    } catch (error) {
        
    }
}
//main('test')

//nsertOneThing();

returnEmnedding('test');