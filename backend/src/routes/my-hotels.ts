import express, {Request, Response} from "express"
import multer from "multer"
import cloudinary from "cloudinary"
import hotel, { HotelType } from "../models/hotel.js"
import Hotel from "../models/hotel.js"
import verifyToken from "../middleware/auth.js"
import {body} from "express-validator"

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5*1024*1024
    }
})
router.post("/", verifyToken,
    [body("name").notEmpty().withMessage("name is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("description").notEmpty().withMessage("description is required"),
        body("type").notEmpty().withMessage("type is required"),
        body("pricepernight").notEmpty().isNumeric().withMessage("pricepernight is required"),
    body("adultcount").notEmpty().isNumeric().withMessage("adult count is required"),
    body("childcount").notEmpty().isNumeric().withMessage("child count is required"),
        body("amenities").notEmpty().isArray().withMessage("amenities are required"),


    ], upload.array("imageFiles", 6), async (req: Request, res: Response) => {
    try {
        const imageFiles = req.files as Express.Multer.File[]
        const newHotel: HotelType = req.body
        const uploadPromise = imageFiles.map(async (image) => {
            const base64 = Buffer.from(image.buffer).toString("base64")
            let dataURI = "data:" + image.mimetype + ";base64," + base64
            const res = await cloudinary.v2.uploader.upload(dataURI)
            return res.url
        })
        const imageURLs = await Promise.all(uploadPromise)
        newHotel.imageURLs = imageURLs
        newHotel.lastupdated = new Date()
        newHotel.userId = req.userId
        const hotel = new Hotel(newHotel)
        await hotel.save()
        res.status(201).send(hotel)

    } catch (e) {
        console.error("Something went wrong while creating the hotel: ", e)
        res.status(500).json({message: "Something went wrong"})
    }
})

export default router