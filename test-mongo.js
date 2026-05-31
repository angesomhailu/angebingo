import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("Testing connection to:", uri.replace(/:([^:@]+)@/, ":***@"));

async function test() {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
}

test();
