import { connect } from "mongoose";

type Connection = {
  isConnected?: number;
};

export const connection: Connection = {};

export default async function connectDB() {
  if (connection.isConnected) {
    console.log("Already connected to the DB");
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  try {
    const db = await connect(process.env.DATABASE_URL);
    connection.isConnected = db.connection.readyState;
    console.log("Successfully connected to the DB");
  } catch (error) {
    console.error("Failed to connect to the DB:", error);
    process.exit(1);
  }
}
