const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cckud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,   
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const sportsEquipments = client.db("SportsEquipments").collection("equipments");

        //Store data to mongoDB
        app.post('/equipments', async (req, res) => {
            const newEquipments = req.body;
            const result = await sportsEquipments.insertOne(newEquipments);
            res.send(result);
        })

        //Read All Sports Equipment
        app.get('/equipments', async (req, res) => {
            const cursor = sportsEquipments.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // 6 Sports Equipment
        app.get('/equipments/limited', async(req, res) => {
            const cursor = sportsEquipments.find().limit(6);
            const result = await cursor.toArray();
            res.send(result);
        })

        //Read Specific equipment Id
        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await sportsEquipments.findOne(query);
            res.send(result);
        })

        //Read Specific equipment email
        app.get('/equipments/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email }
            const result = await sportsEquipments.find(query).toArray();
            res.send(result)
        })

        // Update Equipment
        app.patch('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedEquipment = req.body;
            const equipment = {
                $set: {
                    image: updatedEquipment.image,
                    itemName: updatedEquipment.itemName,
                    categoryName: updatedEquipment.categoryName,
                    price: updatedEquipment.price,
                    rating: updatedEquipment.rating,
                    customization: updatedEquipment.customization,
                    processingTime: updatedEquipment.processingTime,
                    stockStatus: updatedEquipment.stockStatus,
                    userEmail: updatedEquipment.userEmail,
                    userName: updatedEquipment.userName,
                    description: updatedEquipment.description,
                }
            }
            const result = await sportsEquipments.updateOne(filter, equipment, options);
            res.send(result);
        })

        // Delete Equipment
        app.delete('/equipments/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await sportsEquipments.deleteOne(query);
            res.send(result);
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send("Sports Equipment Server is Running");
})

app.listen(port, () => {
    console.log(`Sports Equipments Server is Running on PORT: ${port}`);
})