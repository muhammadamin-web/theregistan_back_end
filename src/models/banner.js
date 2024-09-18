import mongoose from "mongoose"

const Schema = mongoose.Schema

const banner = new Schema(
    {
        image: {
            type: mongoose.Types.ObjectId,
            ref: "Image",
            required: true,
        },
        link: {
            type: String,
        },
        status: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
)

const Banner = mongoose.model("Banner", banner)

export default Banner
