import connectDB, { connection } from "@/db/connectDB";
import User, { type UserInf } from "@/models/User";
import signupSchema from "@/validations/signupSchema";
import bcrypt from "bcryptjs";
import { HydratedDocument } from "mongoose";
import jwt from "jsonwebtoken";
import { sendVerifyLink } from "@/mailers/mailers";

export async function POST(request: Request) {
  try {
    // Validate data
    const parsedData = signupSchema.safeParse(await request.json());
    if (!parsedData.success) {
      return Response.json(
        {
          success: false,
          message: "Bad data",
          error: parsedData.error.flatten(),
        },
        { status: 400 }
      );
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
      return Response.json(
        {
          success: false,
          message:
            "The username is already taken. Please choose a different, unique username.",
        },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    if (existingEmail?.isVerified) {
      return Response.json(
        {
          success: false,
          message:
            "The email is already registered. Please use a different email or log in to your account.",
        },
        { status: 400 }
      );
    }

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in .env");
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

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    async function updateUser(
      user: HydratedDocument<UserInf>
    ): Promise<HydratedDocument<UserInf>> {
      user.fullName = data.fullName;
      user.username = data.username;
      user.email = data.email;
      user.password = hashedPassword;
      await user.save();
      return user;
    }

    let user: HydratedDocument<UserInf>;
    if (existingUsername && !existingUsername.isVerified) {
      user = await updateUser(existingUsername);
    } else if (existingEmail && !existingEmail.isVerified) {
      user = await updateUser(existingEmail);
    } else {
      user = await new User({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        password: hashedPassword,
      }).save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const baseUrl = new URL(request.url).origin;
    await sendVerifyLink(
      data.email,
      `${baseUrl}/verify/${token}`,
      data.fullName
    );

    return Response.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error while signing up:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error.",
      },
      {
        status: 500,
      }
    );
  }
}
