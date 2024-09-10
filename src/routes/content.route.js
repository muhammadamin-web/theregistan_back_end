import express from 'express'
import Content from '../models/content.js'
import AuthMiddleware from '../middleware/auth.middleware.js'
import News from '../models/news.js'

const router = express.Router()

router.post('/', AuthMiddleware, async (req, res) => {
  try {
    const newContent = new Content(req.body)
    const savedContent = await newContent.save()
    return res.status(201).send({
      message: 'Content created successfully',
      data: savedContent,
      success: true,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})
router.get('/', async (req, res) => {
  try {
    const contents = await Content.find().populate('category')
    return res.status(201).send({
      message: 'Content GET successfully',
      data: contents,
      success: true,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
    if (!content) {
      return res.status(404).send({
        message: 'Content not found',
        success: false,
      })
    }
    return res.status(200).send({
      message: 'Content get successfully',
      data: content,
      success: true,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})

router.get('/get-with-news/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('category')
    if (!content) {
      return res.status(404).send({
        message: 'Content not found',
        success: false,
      })
    }

    const relatedNews = await News.find({ category: content.category })

    const resObj = {
      title: content.title,
      category: content.category,
      news: relatedNews,
    }

    return res.status(200).send({
      message: 'Content GET successfully',
      data: resObj,
      success: true,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})

router.put('/:id', AuthMiddleware, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('category')
    if (!content) {
      return res.status(404).send({
        message: 'Content not found',
        success: false,
      })
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      req.body
    )

    return res.status(200).send({
      message: 'Content updated successfully',
      data: updatedContent,
      success: true,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})

router.delete('/:id', AuthMiddleware, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('category')
    if (!content) {
      return res.status(404).send({
        message: 'Content not found',
        success: false,
      })
    }
    await Content.findByIdAndDelete(req.params.id)
    return res.status(200).send({
      message: "Content deleted successfully",
      success:false
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    })
  }
})

export default router
