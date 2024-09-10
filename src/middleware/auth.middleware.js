import jwt from "jsonwebtoken";
import Users from "../models/users.js";

const AuthMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization;

    // Check if the token is present
    if (!token) {
      return res.status(401).send({
        message: "Authorization token missing",
        success: false,
      });
    }

    // Verify the token and extract user ID
    const decodedToken = jwt.verify(token, process.env.JWT_secret);
    const userId = decodedToken.userId;

    // Fetch the user from the database using the user ID
    const user = await Users.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(401).send({
        message: "User not found",
        success: false,
      });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send({
      message: "You are not authorized",
      data: error.message || "Unknown error",
      success: false,
    });
  }
};

export default AuthMiddleware;
