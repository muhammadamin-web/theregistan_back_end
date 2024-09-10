import mongoose from "mongoose";
const Schema = mongoose.Schema;

const page = new Schema(
  {
    name: { type: String },
    content: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Page = mongoose.model("Page", page);
export default Page;
