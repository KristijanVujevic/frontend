import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
const MONGO_DB = process.env.MONGO_DB || "shop";

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGO_URI);
  try {
    await client.connect();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
  cachedClient = client;
  return client;
}

export async function GET(req) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page"), 10) || 1;
  const limit = parseInt(url.searchParams.get("limit"), 10) || 9;
  const skip = (page - 1) * limit;

  const sortBy = url.searchParams.get("sortBy") || "name"; // Default is "name"
  const sortOrder = url.searchParams.get("sortOrder") || "asc"; // Default is "asc"

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);
    const productsCollection = db.collection("products");

    const products = await productsCollection
      .find({})
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .toArray();
    const totalCount = await productsCollection.countDocuments();

    return NextResponse.json({ products, totalCount });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
