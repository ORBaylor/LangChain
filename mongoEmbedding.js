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



async function returnEmnedding(dbID) {

   

    const data = {
        input: dbID,
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
      // console.log('Response:', response.data.data[0].embedding)
       const embedding = response.data.data[0].embedding
       console.log('This is the Embddeing results',embedding);

       

    } catch (error) {
        console.error('Error', error)
    }


}
 
 //returnEmnedding('This is may be the last ');



async function insertOneThing(){
    const usersCollection = client.db('Cluster0').collection('pdf');
    //const usersCollection = client.db.
    
    const testDoc = {
        name: "Mirgration Test "
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
       
    }catch (err){
        console.error('Error inserting document:', err);
    }

  

    
}
//const usersCollection = client.db('Cluster0').collection('pdf');

// const CollectionName = usersCollection.find({_id: "64bdf28cf8214addd7f4064f"}, {name: 1})
//const CollectionName = client.db('Cluster0').collection('pdf');

//console.log(CollectionName);
insertOneThing();