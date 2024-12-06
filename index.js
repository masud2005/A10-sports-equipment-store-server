const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors())

// sportsEquipments
// DauPmoQtWXAhU0r6

const uri = "mongodb+srv://sportsEquipments:DauPmoQtWXAhU0r6@cluster0.cckud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
        await client.connect();

        const sportsEquipments = client.db("SportsEquipments").collection("equipments");

        //Store data to mongoDB
        app.post('/equipments', async (req, res) => {
            const newEquipments = req.body;
            // console.log(newEquipments);
            const result = await sportsEquipments.insertOne(newEquipments);
            res.send(result);
        })

        //Read All Sports Equipment
        app.get('/equipments', async (req, res) => {
            const cursor = sportsEquipments.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //Read Specific equipment Id
        app.get('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            // console.log(query);
            const result = await sportsEquipments.findOne(query);
            res.send(result);
        })

        //Read Specific equipment email
        app.get('/equipments/email/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { userEmail: email }
            // console.log(query);
            const result = await sportsEquipments.find(query).toArray();
            // console.log(result);
            res.send(result)
        })

        // Update Equipment
        app.patch('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const filter = { _id: new ObjectId(id) }
            // console.log(filter);
            const options = { upsert: true };
            const updatedEquipment = req.body;
            // console.log(updatedEquipment);
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
            // console.log(result);
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