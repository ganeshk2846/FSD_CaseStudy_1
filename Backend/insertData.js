import { MongoClient } from "mongodb";
import fs from "fs/promises"; // use promise-based fs

// Connection URL
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

// DB & Collection
const DB_NAME = "ecommerceDB";
const COLLECTION_NAME = "products";

async function insertProducts() {
    try {
        // Connect
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Create unique index (avoid duplicates)
        await collection.createIndex({ id: 1 }, { unique: true });

        // Read JSON file
        const fileData = await fs.readFile("./products.json", "utf-8");
        const jsonData = JSON.parse(fileData);

        // Extract products array
        const products = jsonData.products;

        if (!Array.isArray(products)) {
            throw new Error("Invalid JSON format: 'products' should be an array");
        }

        // Insert data
        const result = await collection.insertMany(products, {
            ordered: false // continue even if duplicates exist
        });

        console.log(`🚀 Inserted ${result.insertedCount} documents`);

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await client.close();
        console.log("🔌 Connection closed");
    }
}

insertProducts();