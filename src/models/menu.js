import mongoose from "mongoose";

const Schema = mongoose.Schema;

const menu = new Schema({
  OrderNumber: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
    required: true,
  },
});

const Menu = mongoose.model("Menu", menu);

export default Menu;
