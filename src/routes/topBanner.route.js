import express from "express";
import AdminMiddleware from "../middleware/admin.middleware.js";
import TopBanner from "../models/topBanner.js";

const router = express.Router();

let topBanner = null;
router.post("/", AdminMiddleware, async (req, res) => {
  try {
    const banner = await TopBanner.findOne();
    if (banner) {
      return res.status(403).send({
        message: "banner allready exist",
        success: false,
      });
    }

    const newTopBanner = new TopBanner(req.body);
    await newTopBanner.save();
    topBanner = null;

    return res.status(201).send({
      message: "banner created successfully",
      data: newTopBanner,
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
    if (!topBanner) {
      topBanner = await TopBanner.find().populate({
        path: "news",
        populate: [
          {
            path: "category",
          },
          {
            path: "image",
          },
        ],
      });
    }
    return res.status(200).send({
      message: "Banner GET successfully",
      data: topBanner,
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
    const topbanner = await TopBanner.findById(req.params.id);
    if (!topbanner) {
      return res.status(404).send({
        message: "topBanner not found",
        success: false,
      });
    }

    const updatetopBanner = await TopBanner.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    topBanner = null;

    return res.status(200).send({
      message: "banner updated successfully",
      data: updatetopBanner,
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
