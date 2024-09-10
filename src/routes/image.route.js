import express from "express";
import upload from "../middleware/ImageMulter.js";
import Image from "../models/image.js";
import { deleteImageFile } from "../utils/deleteImage.js";

import AuthorMiddleware from "../middleware/owner.middleware.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("image"),
  AuthorMiddleware,
  async (req, res) => {
    try {
      const newImage = new Image({
        name: req.file.originalname,
      });

      await newImage.save();

      return res.send({
        message: "Image added successfully",
        data: newImage,
        success: true,
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: error,
        success: false,
      });
    }
  }
);

router.delete("/:id", AuthorMiddleware, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).send({
        message: "Image not found",
        success: false,
      });
    }

    await deleteImageFile(image.name); // Use the utility function

    await Image.findByIdAndDelete(req.params.id);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

export default router;
