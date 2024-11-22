import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
const MONGO_DB = process.env.MONGO_DB || "shop";

let cachedClient = null;

async function connectToDatabase() {
  // Use cached connection if available
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

// Dynamic API route to handle product ID
export async function GET(req, { params }) {
  console.log("GET request received");

  const { id } = await params; // Extract the product ID from URL path (dynamic parameter)
  console.log("Product ID from path:", id); // Log productId to verify it's correct

  if (!id) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);
    const productsCollection = db.collection("products");

    const product = await productsCollection.findOne({
      _id: new ObjectId(id), // Use the ObjectId from the path
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
