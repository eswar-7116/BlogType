import { Schema, Types, model, models, Model } from "mongoose";

// Define the User interface
export interface UserInf {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  bio: string;
  about: string;
  blogs: Types.ObjectId[];
  blogCount: number;
  oauthProvider: string;
  oauthId: string;
  isVerified: boolean;
  createdAt: Date;
}

// Define the instance methods
interface UserMethods {
  incrementBlogCount(): Promise<void>;
}

const UserSchema = new Schema<UserInf, UserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      index: true,
      match: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/i,
    },

    email: {
      type: String,
      required: [
        function () {
          return !this.oauthProvider;
        },
        "E-mail is required",
      ],
      trim: true,
      unique: true,
      index: true,
      sparse: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
    },

    password: {
      type: String,
      required: [
        function () {
          return !this.oauthProvider;
        },
        "Password is required",
      ],
      select: false,
    },

    profileImage: {
      type: String,
      trim: true,
      required: false,
    },

    bio: {
      type: String,
      trim: true,
      required: false,
    },

    about: {
      type: String,
      trim: true,
      required: false,
    },

    blogs: {
      type: [Types.ObjectId],
      ref: "Blog",
      default: [],
    },

    blogCount: {
      type: Number,
      default: 0,
    },

    oauthProvider: {
      type: String,
      required: false,
    },

    oauthId: {
      type: String,
      required: false,
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

UserSchema.index(
  { oauthProvider: 1, oauthId: 1 },
  { unique: true, sparse: true }
);

// Instance methods
UserSchema.methods.incrementBlogCount = async function () {
  this.blogCount += 1;
  await this.save();
};

// Mongoose middlewares
UserSchema.pre("validate", function (next) {
  if (!this.oauthProvider && (!this.email || !this.password)) {
    this.invalidate("email", "Email is required if OAuth is not used.");
    this.invalidate("password", "Password is required if OAuth is not used.");
  }

  if (this.oauthProvider && !this.oauthId) {
    this.invalidate(
      "oauthId",
      "OAuth ID is required when OAuth provider is set."
    );
  }

  next();
});

// Create and export the User model
const User =
  (models.User as Model<UserInf>) || model<UserInf>("User", UserSchema);

export default User;
