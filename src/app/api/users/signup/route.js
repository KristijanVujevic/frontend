import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fetch MongoDB URI and DB from environment variables
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://kristijan:R8jupOPJFDIrRgZu@shopdys.gf9pk.mongodb.net/?retryWrites=true&w=majority&appName=shopdys";
const MONGO_DB = process.env.MONGO_DB || "shop";
const JWT_SECRET = process.env.JWT_SECRET || "SAiLr99GdupQjmWQKU8a2nikMuU7gTHb"; // Add a secret for signing the JWT

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

    // Parse the request body to get the new user details
    const body = await request.json();

    // Basic validation for required fields
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, and password" },
        { status: 400 }
      );
    }

    // Check if user with the same email already exists
    const existingUser = await db
      .collection("users")
      .findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 } // Conflict status code
      );
    }

    // Create the new user object
    const hashedPassword = await bcrypt.hash(body.password, 10); // Hash the password
    const newUser = {
      username: body.username,
      email: body.email,
      password: hashedPassword, // Store the hashed password
      createdAt: new Date(),
      favorites: [],
      role: "user", // Default role to "user", you can modify this logic as needed
    };

    // Insert the new user into the "users" collection
    const result = await db.collection("users").insertOne(newUser);

    // Generate a JWT token for the new user, including the role
    const token = jwt.sign(
      {
        id: result.insertedId.toString(),
        email: newUser.email,
        username: newUser.username,
        role: newUser.role, // Include role in the token
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Return the newly created user with the token
    return NextResponse.json(
      {
        success: true,
        user: { ...newUser, id: result.insertedId.toString() },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to insert user:", error);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 }
    );
  }
}
