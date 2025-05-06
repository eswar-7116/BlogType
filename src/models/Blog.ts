import { Schema, Model, model, models, Types } from "mongoose";
import User from "./User";

// Define the Blog interface
export interface BlogInf {
  blogId: string;
  title: string;
  authorId: Types.ObjectId;
  readTime: number;
  reads: number;
  likes: number;
  tags: string[];
  createdAt: Date;
}

// Define the instance methods
interface BlogMethods {
  incrementReads(): Promise<void>;
  incrementLikes(): Promise<void>;
  decrementLikes(): Promise<void>;
}

const BlogSchema = new Schema<BlogInf, BlogMethods>(
  {
    blogId: {
      type: String,
      required: [true, "Blog ID is required"],
      unique: [true, "Blog ID should be unique"],
      index: true,
      match: /^[0-9A-Za-z]{11}$/,
    },

    title: {
      type: String,
      required: [true, "Blog Title is required"],
      trim: true,
    },

    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author ID is required"],
    },

    readTime: {
      type: Number,
      required: [true, "Read Time is required"],
      min: [0, "Read Time can't be negative"],
    },

    reads: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
      min: [0, "Likes can't be negative"],
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Instance methods
BlogSchema.methods.incrementReads = async function () {
  this.reads += 1;
  await this.save();
};

BlogSchema.methods.incrementLikes = async function () {
  this.likes += 1;
  await this.save();
};

BlogSchema.methods.decrementLikes = async function () {
  if (this.likes > 0) {
    this.likes -= 1;
    await this.save();
  }
};

// Mongoose middlewares
BlogSchema.post("save", async (blog) => {
  try {
    await User.findByIdAndUpdate(blog.authorId, {
      $inc: {
        blogCount: 1,
      },
    });
  } catch (error) {
    console.error(
      `Failed to increment Blog Count for user, ${blog.authorId}:`,
      error
    );
  }
});

// Create and export the Blog model
const Blog =
  (models.Blog as Model<BlogInf>) || model<BlogInf>("Blog", BlogSchema);

export default Blog;
