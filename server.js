import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();
import path from "path";
const __dirname = path.resolve();
import connect from "./src/config/db.config.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors("*"));

import userRoutes from "./src/routes/users.route.js";
import categoryRoutes from "./src/routes/category.route.js";
import imageRoutes from "./src/routes/image.route.js";
import newsRoute from "./src/routes/news.route.js";
import contentsRoute from "./src/routes/content.route.js";
import menuRoute from "./src/routes/menu.route.js";
import bannerRoute from "./src/routes/banner.route.js";
import topbannerRoute from "./src/routes/topBanner.route.js";
import pageRoute from "./src/routes/page.route.js";

app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/v1/api/users", userRoutes);
app.use("/v1/api/category", categoryRoutes);
app.use("/v1/api/image", imageRoutes);
app.use("/v1/api/news", newsRoute);
app.use("/v1/api/content", contentsRoute);
app.use("/v1/api/menu", menuRoute);
app.use("/v1/api/banner", bannerRoute);
app.use("/v1/api/topbanner", topbannerRoute);
app.use("/v1/api/page", pageRoute);
app.get("/madeby", (req, res) => {
  res.send({
    message: "Created by Shohjaxon Sutonov tg https://t.me/shohjaxonsultonov",
  });
});

app.use("/", express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  connect();
  console.log(`Server listening on port ${port}`);
});
