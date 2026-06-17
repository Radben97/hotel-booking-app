import mongoose from "mongoose"
import { HotelType } from "../shared/types.js"

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
    lastupdated: {type: Date, required: true}
})

const Hotel = mongoose.model<HotelType>("Hotel", hotelSchema)
export default Hotel