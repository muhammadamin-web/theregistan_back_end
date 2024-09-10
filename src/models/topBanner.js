import mongoose from "mongoose";

const Schema = mongoose.Schema;

const topBanner = new Schema({
  news: {
    type: mongoose.Types.ObjectId,
    ref: "News",
    required: true,
  },
  status: { type: Boolean, default: true },
});

const TopBanner = mongoose.model("topBanner", topBanner);

export default TopBanner;
