import mongoose from "mongoose";

const Schema = mongoose.Schema;

const users = new Schema({
  name: {
    type: String,
    required: true,
  },
  SurName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  PhoneNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "author"],
    default: "user",
  },
});
const Users = mongoose.model("Users", users);
export default Users;
