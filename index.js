const express = require('express');
const app = express();

const cors = require("cors", )

const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

const uri =`mongodb+srv://sadik1809Aurl:wernoz-dezZog-3merwy@cluster0.ofc9ngg.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () =>{
  try {
    
    await client.connect();

    const db= client.db('simpleCrud');
    const userCollection = db.collection('users');

    app.get('/users', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    } )

    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {
        _id : new Object(id)
      }
      const user = await userCollection.findOne(query)
      console.log('user id', id)
      res.send(user);

    })

   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Simple CRUD server is serving 400')
});

app.listen(port, () => {
  console.log(`Simple CRUD server is running on port ${port}`)
});
