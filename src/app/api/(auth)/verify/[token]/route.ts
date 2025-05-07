import connectDB, { connection } from "@/db/connectDB";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env");
      return Response.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 }
      );
    }

    if (!params.token) {
      return Response.json({ message: "Token not provided" }, { status: 400 });
    }

    const payload = jwt.verify(params.token, process.env.JWT_SECRET);
    if (typeof payload === "string" || !payload.id) {
      return Response.json({
        success: false,
        message: "Invalid payload",
      });
    }

    if (!connection?.isConnected) connectDB();

    await User.findOneAndUpdate(
      { _id: payload.id, isVerified: false },
      { isVerified: true }
    );

    return Response.json({
      success: true,
      message: "Successfully verified user",
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token has expired:", error);
      return Response.json(
        {
          success: false,
          message: "Token expired.",
        },
        { status: 400 }
      );
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error);
      return Response.json(
        {
          success: false,
          message: "Invalid token.",
        },
        { status: 400 }
      );
    } else {
      console.error("Token verification failed:", error);
      return Response.json(
        {
          success: false,
          message: "Internal server error.",
        },
        { status: 500 }
      );
    }
  }
}
