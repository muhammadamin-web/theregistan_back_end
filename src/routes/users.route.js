import express from "express";
import Users from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AuthMiddleware from "../middleware/auth.middleware.js";
import AuthorMiddleware from "../middleware/owner.middleware.js";
const router = express.Router();

router.get("/", AuthorMiddleware, async (req, res) => {
  try {
    const users = await Users.findOne({ _id: req.user._id });
    res.status(200).send({
      message: "Users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.status(404).send({
      message: error.message,
      data: error,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    //   chech user exist
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({
        message: "Access denied: User not found",
        success: false,
      });
    }
    // check password
    const passMatches = await bcrypt.compare(req.body.password, user.password);
    if (!passMatches) {
      return res.status(403).send({
        message: "Access denied: Password didn't match",
        success: false,
      });
    }
    //   token generate
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_secret,
      { expiresIn: "1d" }
    );

    user.password = undefined;
    return res.status(200).send({
      message: "User logged in",
      success: true,
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// Register user
router.post("/register", async (req, res) => {
  try {
    // chech user exist
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      return res.status(404).send({
        message: "Access denied: User allready exist",
        success: false,
      });
    }
    //   password hashing
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password, salt);
    req.body.password = pass;

    //   create new User
    const newUser = new Users(req.body);
    const savedNewUser = await newUser.save();
    const token = jwt.sign(
      {
        userId: savedNewUser._id,
      },
      process.env.JWT_secret,
      { expiresIn: "1d" }
    );
    savedNewUser.password = undefined;
    res.send({
      message: "User registered successfully",
      data: savedNewUser,
      token: token,
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

router.put("/edit", AuthMiddleware, async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({
        message: "Access denied: User not found",
        success: false,
      });
    }

    // Update the user's password if provided
    if (req.body.password) {
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).send({
          message: "Password is not match",
          success: false,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPassword;
    }
    // Update the user
    const updatedUser = await Users.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });

    updatedUser.password = undefined;

    return res.status(200).send({
      message: "User updated successfully",
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: error,
      success: false,
    });
  }
});

router.delete("/delete/:id", AuthMiddleware, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    // Check if the user exists
    if (!user) {
      return res.status(404).send({
        message: "Access denied: User not found",
        success: false,
      });
    }

    // Delete the user
    await Users.findByIdAndDelete(req.params.id);

    return res.status(200).send({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.post("/set-admin/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    await Users.findByIdAndUpdate(req.params.id, {
      role: "admin",
    });

    const updatedUser = await Users.findById(req.params.id);
    updatedUser.password = undefined;
    return res.status(200).send({
      message: "User updated to admin",
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

router.post("/set-author/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }
    await Users.findByIdAndUpdate(req.params.id, {
      role: "author",
    });

    const updatedUser = await Users.findById(req.params.id);

    return res.status(200).send({
      message: "updated to author",
      data: updatedUser,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      success: false,
    });
  }
});

export default router;
