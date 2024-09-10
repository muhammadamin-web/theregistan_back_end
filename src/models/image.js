import mongoose from 'mongoose'
const Schema = mongoose.Schema

const image = new Schema({
  name: String,
  content: Buffer,
})



const Image = mongoose.model('Image', image)
export default Image
