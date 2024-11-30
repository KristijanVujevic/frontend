import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// Environment variables
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://kristijan:R8jupOPJFDIrRgZu@shopdys.gf9pk.mongodb.net/?retryWrites=true&w=majority&appName=shopdys";
const MONGO_DB = process.env.MONGO_DB || "shop";
const JWT_SECRET = process.env.JWT_SECRET || "SAiLr99GdupQjmWQKU8a2nikMuU7gTHb";

let cachedClient = null;

// Connect to MongoDB
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

// POST: Add or remove a product from favorites
export async function POST(request) {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id;
    const userObjectId = new ObjectId(userId);

    const body = await request.json();
    const { productId, action } = body;

    if (!productId || !["add", "remove", "check"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request. Provide productId and action." },
        { status: 400 }
      );
    }

    // If action is 'check', return the liked status
    if (action === "check") {
      const user = await db.collection("users").findOne({ _id: userObjectId });
      if (user && user.favorites && user.favorites.includes(productId)) {
        return NextResponse.json({ isLiked: true }, { status: 200 });
      }
      return NextResponse.json({ isLiked: false }, { status: 200 });
    }

    // Handle add/remove action
    let update;
    if (action === "add") {
      update = { $addToSet: { favorites: productId } };
    } else if (action === "remove") {
      update = { $pull: { favorites: productId } };
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: userObjectId }, update);

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "Failed to update favorites." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Favorites updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update favorites:", error);
    return NextResponse.json(
      { error: "Failed to update favorites" },
      { status: 500 }
    );
  }
}
export async function GET(request) {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

    // Extract the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode the JWT
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.id; // Extract the user ID from the token payload
    const userObjectId = new ObjectId(userId);

    // Fetch the user's liked products (favorites)
    const user = await db.collection("users").findOne({ _id: userObjectId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the products based on the user's favorite product IDs
    const likedProducts = await db
      .collection("products")
      .find({ _id: { $in: user.favorites.map((id) => new ObjectId(id)) } })
      .toArray();

    return NextResponse.json(likedProducts); // Send back the liked products
  } catch (error) {
    console.error("Failed to fetch liked products:", error);
    return NextResponse.json(
      { error: "Failed to fetch liked products" },
      { status: 500 }
    );
  }
}
