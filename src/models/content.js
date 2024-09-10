import mongoose from 'mongoose'

const Schema = mongoose.Schema

const content = new Schema({
  title: {
    default: {
      type: Array,
      required: true,
    },
    delta: {
      type: String,
    },
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  ],
})

const Content = mongoose.model('Content', content)

export default Content
