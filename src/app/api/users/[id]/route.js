import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// Environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
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

// GET: Fetch user data by ID
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

    // Convert `userId` to an ObjectId
    const userObjectId = new ObjectId(userId);

    // Find the user in the database
    const user = await db.collection("users").findOne({ _id: userObjectId });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user data (exclude sensitive fields)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          favorites: user.favorites || [],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
