import express, { Request, Response } from "express"
import verifyToken from "../middleware/auth.js"
import Hotel from "../models/hotel.js"
import { HotelType } from "../shared/types.js"
const router = express.Router()

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({
            bookings: {$elemMatch:{userId: req.userId}}
        })
        const result = hotels.map((hotel) => {
            const userBookings = hotel.bookings.filter((booking) => booking.userId === req.userId)
            const hotelWithUserBookings: HotelType = {
                ...hotel.toObject(),
                bookings: userBookings
            }
            return hotelWithUserBookings
        })
        res.status(200).json(result)
    } catch (err) {
        console.log(err)
        res.status(500).json({message: "Error fetching bookings"})
    }
})

export default router