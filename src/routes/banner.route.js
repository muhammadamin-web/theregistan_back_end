import express from "express";
import Banner from "../models/banner.js";
import AdminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

let banner = null;

router.post("/", AdminMiddleware, async (req, res) => {
  try {
    const banner = await Banner.findOne();
    if (banner) {
      return res.status(403).send({
        message: "banner allready exist",
        success: false,
      });
    }

    const newBanner = new Banner(req.body);

    await newBanner.save();

    return res.status(201).send({
      message: "banner created successfully",
      data: newBanner,
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
    if (!banner) {
      banner = await Banner.find().populate("image");
    }
    return res.status(200).send({
      message: "Banner GET successfully",
      data: banner,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.put("/:id", AdminMiddleware, async (req, res) => {
  try {
    const bannerold = await Banner.findById(req.params.id);
    if (!bannerold) {
      return res.status(404).send({
        message: "banner not found",
        success: false,
      });
    }

    const updatebanner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    banner = null;
    return res.status(200).send({
      message: "banner updated successfully",
      data: updatebanner,
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
