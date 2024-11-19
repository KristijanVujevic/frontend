import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
const MONGO_DB = process.env.MONGO_DB || "shop";

let cachedClient = null;

async function connectToDatabase() {
  // Use cached connection if available
  if (cachedClient) return cachedClient;

  // Create a new MongoDB client and connect
  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
  cachedClient = client; // Cache the client for future requests
  return client;
}

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);
    const products = await db.collection("products").find({}).toArray();

    // Return the list of products as a JSON response
    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
