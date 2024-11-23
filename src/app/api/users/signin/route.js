import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/shop";
const MONGO_DB = process.env.MONGO_DB || "shop";
const JWT_SECRET = process.env.JWT_SECRET || "SAiLr99GdupQjmWQKU8a2nikMuU7gTHb";

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

export async function POST(request) {
  try {
    const client = await connectToDatabase();
    const db = client.db(MONGO_DB);

    // Parse the request body to get the user credentials
    const body = await request.json();

    // Basic validation for required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields: email and password" },
        { status: 400 }
      );
    }

    // Find the user with the given email
    const user = await db.collection("users").findOne({ email: body.email });

    if (!user) {
      // If no user is found, return a 401 Unauthorized response
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      // If the password doesn't match, return a 401 Unauthorized response
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a JWT token (expires in 30 days) and include the user's role
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      }, // include role in the token
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return the user data, role, and token
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role, // send the user's role in the response
          favorites: user.favorites,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to authenticate user:", error);
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
