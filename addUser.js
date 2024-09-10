import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Users from "./src/models/users.js"; // Users modelini import qiling

// Mongoose bilan ulanish
mongoose.connect('mongodb://localhost:27017/theregistan');

// Foydalanuvchi ma'lumotlarini kiriting
const userData = {
  name: "John",
  SurName: "Doe",
  email: "newemail@example.com",
  PhoneNumber: "+123456789",
  password: "password123",  // Parol shu yerda hash qilinadi
  role: "user"  // Admin yoki author deb ham o'zgartirish mumkin
};

// Yangi foydalanuvchini yaratish
const addUser = async () => {
  try {
    // Email bor-yo'qligini tekshirish
    const existingUser = await Users.findOne({ email: userData.email });
    if (existingUser) {
      console.log("Email allaqachon mavjud:", existingUser.email);
      return;
    }
// mongodump --uri="mongodb://localhost:27017/theregistan" --out=./backup

    // Parolni hash qilish
    const saltRounds = 10; // Hashlashning darajasi
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Hashlangan parolni foydalanuvchi ma'lumotlariga qo'shish
    userData.password = hashedPassword;

    const newUser = new Users(userData);
    await newUser.save();
    console.log("Foydalanuvchi muvaffaqiyatli qo'shildi");
  } catch (error) {
    console.error("Foydalanuvchini qo'shishda xatolik yuz berdi:", error);
  } finally {
    mongoose.connection.close(); // Ulanishni yopish
  }
};

// Foydalanuvchini qo'shish funksiyasini chaqirish
addUser();
