import mongoose from "mongoose";
const Schema = mongoose.Schema;

const news = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: Object,
      required: true,
    },
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readTime: { type: Number, default: 0 },
    date: {
      type: Date,
      required: true,
    },
    isColored: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
    },
    bgColor: {
      type: String,
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", news);
export default News;
