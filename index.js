const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Start MongoDB

const uri = `mongodb+srv://${process.env.mongoDB_UserName}:${process.env.nongoDB_Password}@cluster0.k4gmzpi.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const TaskCollection = client
            .db("task-management")
            .collection("all-task");

        // Register User Info
        app.post("/task/add", async (req, res) => {
            const user = req.body;
            const result = await TaskCollection.insertOne(user);
            res.send(result);
        });

        // Get a Seller all products
        app.get("/user/task", async (req, res) => {
            const email = req.query.email;
            const query = { user: email };
            const cursor = await TaskCollection.find(query).toArray();
            res.send(cursor);
        });

        app.delete("/post/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await TaskCollection.deleteOne(query);
            res.send(result);
        });

        app.get("/update/:taskid", async (req, res) => {
            const id = req.params.taskid;
            const query = { _id: ObjectId(id) };
            const result = await TaskCollection.findOne(query);
            res.send(result);
        });

        app.patch("/update/:taskid", async (req, res) => {
            const task = req.body;
            const id = req.params.taskid;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: task.title,
                    desc: task.desc,
                },
            };
            const result = await TaskCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
        });

        // Compleated Task
        app.patch("/completed/:taskid", async (req, res) => {
            const id = req.params.taskid;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    completed: true,
                },
            };
            const result = await TaskCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
        });

        // Get Completed task
        app.get("/completed", async (req, res) => {
            const email = req.query.email;
            const query = { user: email, completed: true };
            const cursor = await TaskCollection.find(query).toArray();
            res.send(cursor);
        });
    } finally {
    }
}
run().catch(console.log);
// End MongoDB

app.get("/", (req, res) => {
    res.send("Hello from Task management server!");
});

app.listen(port, () => {
    console.log(`Task Management app listening on port ${port}`);
});
