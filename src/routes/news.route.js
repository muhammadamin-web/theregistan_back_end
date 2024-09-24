import express from "express"
import News from "../models/news.js"
import AuthorMiddleware from "../middleware/owner.middleware.js"

const router = express.Router()

function transliterate(title) {
    const translitMap = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "shch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
        А: "A",
        Б: "B",
        В: "V",
        Г: "G",
        Д: "D",
        Е: "E",
        Ё: "Yo",
        Ж: "Zh",
        З: "Z",
        И: "I",
        Й: "Y",
        К: "K",
        Л: "L",
        М: "M",
        Н: "N",
        О: "O",
        П: "P",
        Р: "R",
        С: "S",
        Т: "T",
        У: "U",
        Ф: "F",
        Х: "Kh",
        Ц: "Ts",
        Ч: "Ch",
        Ш: "Sh",
        Щ: "Shch",
        Ъ: "",
        Ы: "Y",
        Ь: "",
        Э: "E",
        Ю: "Yu",
        Я: "Ya",
    }

    return title
        .split("")
        .map((char) => translitMap[char] || char)
        .join("")
}

function generateSlug(title) {
    // Kirilcha harflarni lotin harflariga o'tkazish
    const transliteratedTitle = transliterate(title)

    return transliteratedTitle
        .toLowerCase() // Kichik harflarga o'zgartirish
        .trim() // Bosh va oxiridagi bo'shliqlarni olib tashlash
        .replace(/[^a-zA-Z0-9\s-]/g, "") // Maxsus belgilarni olib tashlash
        .replace(/\s+/g, "-") // Bo'shliqlarni chiziqcha bilan almashtirish
}

router.post("/", AuthorMiddleware, async (req, res) => {
    try {
        //   create new news
        const { title } = req.body
        let slug = generateSlug(title)
        let slugExists = await News.findOne({ slug: slug })

        // Agar slug mavjud bo'lsa, slugga raqam qo'shish va qayta tekshirish
        let count = 1
        while (slugExists) {
            // Slugni raqam bilan yangilash
            slug = `${generateSlug(title)}-${count}`
            slugExists = await News.findOne({ slug: slug })
            count++
        }

        req.body.author = req.user._id
        req.body.slug = slug
        const newNews = new News(req.body)
        await newNews.save()
        return res.status(201).send({
            message: "News created successfully",
            data: newNews,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

router.get("/", async (req, res) => {
    const perPage = 12
    let { page, title, category } = req.query
    page = page || 1
    let query = {}
    if (title) {
        const escapedInput = title.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") // Escape special characters
        const regexPattern = new RegExp(escapedInput, "i")
        query.title = { $regex: regexPattern }
    }
    if (category && category !== "undefined" && category !== "null") query.category = category

    const count = await News.countDocuments(query)

    try {
        const news = await News.find(query)
            .skip(perPage * page - perPage)
            .sort({ date: -1 })
            .limit(perPage)
            .populate("image category")
        return res.status(200).json({
            news,
            current: page,
            pages: Math.ceil(count / perPage),
            allFindedPosts: count,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

router.get("/:slug", async (req, res) => {
    try {
        const news = await News.findOne({ slug: req.params.slug }).populate("image category")
        if (!news) {
            return res.status(404).send({
                message: "News not found",
                success: false,
            })
        }
        return res.status(200).send({
            message: "News GET successfully",
            data: news,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})
router.put("/:id", AuthorMiddleware, async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
        if (!news) {
            return res.status(404).send({
                message: "News not found",
                success: false,
            })
        }

        const { title } = req.body
        let slug = generateSlug(title)
        let slugExists = await News.findOne({ slug: slug })

        // Agar slug mavjud bo'lsa, slugga raqam qo'shish va qayta tekshirish
        let count = 1
        while (slugExists) {
            // Slugni raqam bilan yangilash
            slug = `${generateSlug(title)}-${count}`
            slugExists = await News.findOne({ slug: slug })
            count++
        }
        req.body.slug = slug

        const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body)
        return res.status(200).send({
            message: "News updated successfully",
            data: updatedNews,
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})
router.delete("/:id", AuthorMiddleware, async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
        if (!news) {
            return res.status(404).send({
                message: "News not found",
                success: false,
            })
        }
        await News.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            message: "News deleted successfully",
            success: true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            data: error,
            success: false,
        })
    }
})

export default router
