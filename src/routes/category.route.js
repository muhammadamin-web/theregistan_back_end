import express from "express";
import Category from "../models/category.js";
import AdminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/", AdminMiddleware, async (req, res) => {
  try {
    //   check category
    const escapedInput = req.body.name.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    ); // Escape special characters
    const regexPattern = new RegExp(escapedInput, "i");
    const category = await Category.findOne({ name: { $regex: regexPattern } });
    if (category) {
      return res.status(403).send({
        message: "Category allready exist",
        success: false,
      });
    }

    //   create new category
    const newCategory = new Category(req.body);
    await newCategory.save();
    return res.status(201).send({
      message: "Category created successfully",
      data: newCategory,
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
  try {
    const categories = await Category.find().populate("image");
    return res.status(200).send({
      message: "Categories GET successfully",
      data: categories,
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

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate("image");
    if (!category) {
      return res.status(404).send({
        message: "Category not found",
        success: false,
      });
    }
    return res.status(200).send({
      message: "Categories GET successfully",
      data: category,
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
router.put("/:id", AdminMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        message: "Category not found",
        success: false,
      });
    }

    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.status(200).send({
      message: "Category updated successfully",
      data: updateCategory,
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
router.delete("/:id", AdminMiddleware, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        message: "Category not found",
        success: false,
      });
    }
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      message: "Category deleted successfully",
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
