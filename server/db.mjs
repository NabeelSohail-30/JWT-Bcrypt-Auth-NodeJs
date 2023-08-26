import { MongoClient } from "mongodb";

const uri = "mongodb+srv://dbuser:dbpassword@cluster0.9ha3mra.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
        return client.db();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function closeDatabaseConnection() {
    try {
        await client.close();
        console.log("Database connection closed");
    } catch (err) {
        console.error(err);
    }
}