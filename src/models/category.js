import mongoose from 'mongoose'

const Schema = mongoose.Schema

const category = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: mongoose.Types.ObjectId,
    ref: 'Image',
  },
})
const Category = mongoose.model('Category', category)
export default Category
