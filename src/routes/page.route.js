import express from "express";
import AdminMiddleware from "../middleware/admin.middleware.js";
import Page from "../models/page.js";

const router = express.Router();
let pages = null;

router.post("/", AdminMiddleware, async (req, res) => {
  try {
    //   create new page
    const page = new Page(req.body);
    await page.save();
    pages = null;
    return res.status(201).send(page);
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
    if (!pages) {
      pages = await Page.find();
    }

    return res.status(200).send(pages);
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// router.get("/:id", async (req, res) => {
//   try {
//     const page = await Page.findById(req.params.id);
//     if (!page) {
//       return res.status(404).send({
//         message: "Page not found",
//         success: false,
//       });
//     }
//     return res.status(200).send({
//       message: "Page GET successfully",
//       data: page,
//       success: true,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//       data: error,
//       success: false,
//     });
//   }
// });

router.put("/:id", AdminMiddleware, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).send({
        message: "page not found",
        success: false,
      });
    }

    const updatePage = await Page.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    pages = null;
    return res.status(200).send(updatePage);
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
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).send({
        message: "Page not found",
        success: false,
      });
    }
    await Page.findByIdAndDelete(req.params.id);
    pages = null;
    return res.status(200).send({
      message: "Page deleted successfully",
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
