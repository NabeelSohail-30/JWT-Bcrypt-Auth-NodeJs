import { MongoClient } from "mongodb";

const uri = 'mongodb+srv://NabeelSohail:Nabeel30@cluster0.lidnkc6.mongodb.net/';
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
        return client.db("sample_airbnb");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function closeDatabaseConnection() {
    try {
        await client.close();
        console.log("Database connection closed");
    } catch (err) {
        console.error(err);
    }
}

export { connectToDatabase, closeDatabaseConnection };