// utils.js
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

export const deleteImageFile = async (imageName) => {
  const imagePath = path.join(__dirname, "upload", imageName);

  return new Promise((resolve, reject) => {
    fs.unlink(imagePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
