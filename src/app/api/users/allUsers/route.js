import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://kristijan:R8jupOPJFDIrRgZu@shopdys.gf9pk.mongodb.net/?retryWrites=true&w=majority&appName=shopdys";
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

export async function GET(req) {
  const url = new URL(req.url);

  try {
    const client = await connectToDatabase();
    const db = client.db(process.env.MONGO_DB);
    const usersCollection = db.collection("users");

    const allUsers = await usersCollection.find({}).toArray();
    const totalCount = await usersCollection.countDocuments();

    return NextResponse.json({ allUsers, totalCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
