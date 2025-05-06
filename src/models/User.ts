import { HydratedDocument, Schema, Model, model, models } from "mongoose";

export type UserInf = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  about: string;
  blogs: Schema.Types.ObjectId[];
  blogCount: number;
  oauthProvider: string;
  oauthId: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  createdAt: Date;
};

export type UserDocument = HydratedDocument<UserInf>;

const UserSchema = new Schema<UserDocument>(
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
      default: null,
    },

    about: {
      type: String,
      trim: true,
      default: null,
    },

    blogs: {
      type: [Schema.Types.ObjectId],
      ref: "Blog",
      default: [],
    },

    blogCount: {
      type: Number,
      default: 0,
    },

    oauthProvider: {
      type: String,
      default: null,
    },

    oauthId: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },

    verifyCode: {
      type: String,
      match: /^\d{6}$/,
      trim: true,
      required: [
        function () {
          return !this.oauthProvider;
        },
        "Verification Code is required",
      ],
      select: false,
    },

    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verification code expiry is required"],
      select: false,
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

UserSchema.methods.incrementBlogCount = async function () {
  this.blogCount += 1;
  await this.save();
};

UserSchema.statics.usernameExists = async function (username: string) {
  return await this.exists({
    username,
    isVerified: true,
  });
};

UserSchema.statics.emailExists = async function (email: string) {
  return await this.exists({
    email,
    isVerified: true,
  });
};

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

const User =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", UserSchema);

export default User;
