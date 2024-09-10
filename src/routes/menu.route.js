import express from "express";
import Menu from "../models/menu.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", AuthMiddleware, async (req, res) => {
  try {
    const newMenu = new Menu(req.body);
    await newMenu.save();
    return res.status(201).send({
      message: "menu created successfully",
      data: newMenu,
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
    const menu = await Menu.find()
      .populate("category")
      .sort({ OrderNumber: 1 });
    return res.status(200).send({
      message: "menu GET successfully",
      data: menu,
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
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).send({
        message: "menu not found",
        success: false,
      });
    }
    return res.status(200).send({
      message: "menu GET successfully",
      data: menu,
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
router.put("/:id", AuthMiddleware, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).send({
        message: "menu not found",
        success: false,
      });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send({
      message: "menu updated successfully",
      data: updatedMenu,
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
router.delete("/:id", AuthMiddleware, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).send({
        message: "menu not found",
        success: false,
      });
    }
    await Menu.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      message: "menu deleted successfully",
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
