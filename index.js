require('dotenv').config();
const express = require('express');
const app = express();

const cors = require("cors" )

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

const uri =process.env.MONGODB_URI;

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
        _id : new ObjectId(id)
      }
      const user = await userCollection.findOne(query)
      console.log(user)
      res.send(user);

    })

    app.post('/users', async(req, res) =>{

      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);

    })

    app.patch('/users/:id', async(req, res) => {
      const id = req.params.id;
      
      const filter = {
        _id : new ObjectId(id)
      }
      const modifiedUser = req.body;
      const updatedDocument ={
        $set :{
          name : modifiedUser.name,
          email : modifiedUser.email,
          role : modifiedUser.role,
        }
      }
      const result = await userCollection.updateOne(filter, updatedDocument);
      res.send(result);
    })

    app.delete('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {
        _id : new ObjectId(id)
      }
      const result = await userCollection.deleteOne(query)
      
      res.send(result);

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

module.exports = app;

app.listen(port, () => {
  console.log(`Simple CRUD server is running on port ${port}`)
});

