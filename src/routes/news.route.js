import express from "express";
import News from "../models/news.js";
import AuthorMiddleware from "../middleware/owner.middleware.js";

const router = express.Router();
router.post("/", AuthorMiddleware, async (req, res) => {
  try {
    //   create new news
    req.body.author = req.user._id;
    const newNews = new News(req.body);
    await newNews.save();
    return res.status(201).send({
      message: "News created successfully",
      data: newNews,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.get("/", async (req, res) => {
  const perPage = 12;
  let { page, title, category } = req.query;
  page = page || 1;
  let query = {};
  if (title) {
    const escapedInput = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"); // Escape special characters
    const regexPattern = new RegExp(escapedInput, "i");
    query.title = { $regex: regexPattern };
  }
  if (category && category !== "undefined" && category !== "null")
    query.category = category;

  const count = await News.countDocuments(query);

  try {
    const news = await News.find(query)
      .skip(perPage * page - perPage)
      .sort({ date: -1 })
      .limit(perPage)
      .populate("image category");
    return res.status(200).json({
      news,
      current: page,
      pages: Math.ceil(count / perPage),
      allFindedPosts: count,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("image category");
    if (!news) {
      return res.status(404).send({
        message: "News not found",
        success: false,
      });
    }
    return res.status(200).send({
      message: "News GET successfully",
      data: news,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});
router.put("/:id", AuthorMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).send({
        message: "News not found",
        success: false,
      });
    }

    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send({
      message: "News updated successfully",
      data: updatedNews,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});
router.delete("/:id", AuthorMiddleware, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).send({
        message: "News not found",
        success: false,
      });
    }
    await News.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      message: "News deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

export default router;
