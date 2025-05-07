import connectDB, { connection } from "@/db/connectDB";
import User, { type UserInf } from "@/models/User";
import signupSchema from "@/validations/signupSchema";
import bcrypt from "bcryptjs";
import { HydratedDocument } from "mongoose";

export async function POST(request: Request) {
  try {
    let requestData = await request.json();

    // Validate data
    const parsedData = signupSchema.safeParse(requestData);
    if (!parsedData.success) {
      return Response.json({
        success: false,
        message: "Bad data",
        error: parsedData.error.flatten(),
      });
    }
    const data: UserInf = parsedData.data as UserInf;

    // Connect DB if not connected
    if (!connection.isConnected) await connectDB();

    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: data.username }),
      User.findOne({ email: data.email }),
    ]);

    // Check if the username exists
    if (existingUsername?.isVerified) {
      return Response.json({
        success: false,
        message:
          "The username is already taken. Please choose a different, unique username.",
      });
    }

    // Check if the email is already registered
    if (existingEmail?.isVerified) {
      return Response.json({
        success: false,
        message:
          "The email is already registered. Please use a different email or log in to your account.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    async function updateUser(user: HydratedDocument<UserInf>) {
      user.fullName = data.fullName;
      user.username = data.username;
      user.email = data.email;
      user.password = hashedPassword;
      await user.save();
    }

    if (existingUsername && !existingUsername.isVerified) {
      await updateUser(existingUsername);
    } else if (existingEmail && !existingEmail.isVerified) {
      await updateUser(existingEmail);
    } else {
      new User({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      }).save();
    }

    return Response.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error while signing up:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
