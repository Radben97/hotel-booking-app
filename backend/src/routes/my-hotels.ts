import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { HotelType } from "../shared/types.js";
import Hotel from "../models/hotel.js";
import verifyToken from "../middleware/auth.js";
import { body } from "express-validator";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("name is required"),
    body("city").notEmpty().withMessage("city is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("type").notEmpty().withMessage("type is required"),
    body("pricepernight")
      .notEmpty()
      .isNumeric()
      .withMessage("pricepernight is required"),
    body("adultcount")
      .notEmpty()
      .isNumeric()
      .withMessage("adult count is required"),
    body("childcount")
      .notEmpty()
      .isNumeric()
      .withMessage("child count is required"),
    body("amenities")
      .notEmpty()
      .isArray()
      .withMessage("amenities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      const imageURLs = await uploadImages(imageFiles);
      newHotel.imageURLs = imageURLs;
      newHotel.lastupdated = new Date();
      newHotel.userId = req.userId;
      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).send(hotel);
    } catch (e) {
      console.error("Something went wrong while creating the hotel: ", e);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const hotelId = req.params.id?.toString();
  try {
    if (!hotelId) {
      res.status(404).json({ message: "HotelId is required" });
    }
    const hotel = await Hotel.findOne({ _id: hotelId!, userId: req.userId });
    res.status(200).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Hotel could not be fetched" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    const updatedHotel = req.body;
    try {
      const newHotel = await Hotel.findOneAndUpdate(
        {
          _id: updatedHotel.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true },
      );
      if (!newHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const imagefiles = req.files as Express.Multer.File[];
      const uploadedImageUrls = await uploadImages(imagefiles || []);
      const existingImageUrls = Array.isArray(req.body.imageURLs)
        ? req.body.imageURLs
        : req.body.imageURLs
          ? [req.body.imageURLs]
          : [];
      newHotel.imageURLs = [...existingImageUrls, ...uploadedImageUrls];
      console.log(newHotel.imageURLs);
      await newHotel.save();
      return res.status(200).json(newHotel);
    } catch (error) {
      res.status(500).json({ message: "Update could not be completed" });
    }
  },
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromise = imageFiles.map(async (image) => {
    const base64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + base64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });
  const imageURLs = await Promise.all(uploadPromise);
  return imageURLs;
}

export default router;
