import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { checkAuthStatus } from "@/app/redux/slices/authSlice";

// Environment variables
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://kristijan:R8jupOPJFDIrRgZu@shopdys.gf9pk.mongodb.net/?retryWrites=true&w=majority&appName=shopdys";
const MONGO_DB = process.env.MONGO_DB || "shop";
const JWT_SECRET = process.env.JWT_SECRET || "SAiLr99GdupQjmWQKU8a2nikMuU7gTHb";

let cachedClient = null;

// Helper function to verify token
async function verifyToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Missing or invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

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
    const decoded = await verifyToken(request); // Verify token and get decoded info

    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

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
      { error: error.message || "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user by ID
export async function DELETE(request) {
  try {
    const decoded = await verifyToken(request); // Verify token and get decoded info
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

    // Extract the user ID to delete from the request URL
    const url = new URL(request.url);
    const idToDelete = url.pathname.split("/").pop();

    // Convert `idToDelete` to an ObjectId
    const userObjectIdToDelete = new ObjectId(idToDelete);

    // Delete the user from the database
    const result = await db
      .collection("users")
      .deleteOne({ _id: userObjectIdToDelete });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
// PATCH: Update username of the user by ID
export async function PATCH(request) {
  try {
    const decoded = await verifyToken(request); // Verify token and get decoded info
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

    const userId = decoded.id; // Extract the user ID from the token payload

    // Convert `userId` to an ObjectId
    const userObjectId = new ObjectId(userId);

    // Parse the request body to get the new username
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Invalid username" }, { status: 400 });
    }

    // Update the username in the database
    const result = await db
      .collection("users")
      .updateOne({ _id: userObjectId }, { $set: { username } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Username updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update username:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update username" },
      { status: 500 }
    );
  }
}
