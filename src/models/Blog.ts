import { HydratedDocument, Schema, Model, model, models } from 'mongoose';
import User from './User';

export type BlogDocument = HydratedDocument<{
    blogId: string,
    title: string,
    authorId: Schema.Types.ObjectId,
    readTime: number,
    reads: number,
    likes: number,
    tags: string[],
    createdAt: Date
}>

const BlogSchema = new Schema<BlogDocument>(
    {
        blogId: {
            type: String,
            required: [true, 'Blog ID is required'],
            unique: [true, 'Blog ID should be unique'],
            index: true,
            match: /^[0-9A-Za-z]{11}$/,
        },

        title: {
            type: String,
            required: [true, 'Blog Title is required'],
            trim: true,
        },

        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Author ID is required'],
        },

        readTime: {
            type: Number,
            required: [true, 'Read Time is required'],
            min: [0, 'Read Time can\'t be negative'],
        },

        reads: {
            type: Number,
            default: 0,
        },

        likes: {
            type: Number,
            default: 0,
            min: [0, 'Likes can\'t be negative'],
        },

        tags: {
            type: [String],
            default: [],
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false }
    }
);

BlogSchema.methods.incrementReads = function () {
    this.reads += 1;
    this.save();
}

BlogSchema.methods.incrementLikes = function () {
    this.likes += 1;
    this.save();
}

BlogSchema.methods.decrementLikes = function () {
    if (this.likes > 0) {
        this.likes -= 1;
        this.save();
    }
}

BlogSchema.post('save', async (blog) => {
    try {
        await User.findByIdAndUpdate(blog.authorId, {
            $inc: {
                blogCount: 1
            }
        });
    } catch(error) {
        console.error(`Failed to increment Blog Count for user, ${blog.authorId}:`, error);
    }
})

const Blog = (models.Blog as Model<BlogDocument>) || model<BlogDocument>('Blog', BlogSchema);

export default Blog;