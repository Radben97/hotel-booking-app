import mongoose from "mongoose"
import { HotelType,bookingType } from "../shared/types.js"

const bookingSchema = new mongoose.Schema<bookingType>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    adultcount: { type: Number, required: true },
    childcount: { type: Number, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    userId: { type: String, required: true },
    totalCost: {type:Number,required:true}
})

const hotelSchema = new mongoose.Schema<HotelType>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    pricepernight: {type: Number, required: true},
    adultcount: { type: Number, required: true },
    childcount: { type: Number, required: true },
    amenities: [{ type: String, required: true }],
    starrating: { type: Number, required: true, min: 0, max: 5 },
    imageURLs: [{ type: String, required: true }],
    lastupdated: { type: Date, required: true },
    bookings: [bookingSchema]
})

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema)
export default Hotel