import express, { Request, Response } from "express"
import Hotel from "../models/hotel.js"
import { HotelResponse, HotelType } from "../shared/types.js"
import { param, validationResult } from "express-validator"
const router = express.Router()

router.get("/search", async (req: Request, res: Response) => {
    console.log("--------------------")
    console.log("query", req.query)
    console.log("--------------------")
    const pageSize = 5
    const pageNumber = req.query.page ? Number(req.query.page) : 1
    const skip = (pageNumber - 1) * pageSize
    const filterQuery = constructQuery(req.query)
    let sortOptions = {}
    switch (req.query.sortOptions) {
        case "starrating":
            sortOptions = { starrating: -1 }
            break
        case "pricepernightasc":
            sortOptions = { pricepernight: 1 }
            break
        case "pricepernightdesc":
            sortOptions = { pricepernight: -1 }
            break
        
    }
    try {
        const hotels = await Hotel.find(filterQuery).sort(sortOptions).skip(skip).limit(pageSize)
        const total = await Hotel.countDocuments(filterQuery)
        const response: HotelResponse = {
            hotels: hotels,
            pagination: {
                total: total,
                pageNumber: pageNumber,
                pages: (Math.ceil(total/pageSize))
            }
        }
        console.log(response)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Could not fetch all hotels"})
    }
})

const constructQuery = (queryParams: any) => {
    const queryObj: any = {}

    if (queryParams.destination) {
        queryObj.$or = [
            {city: new RegExp(queryParams.destination,"i")},
            {country: new RegExp(queryParams.destination,"i")},
        ]
    }

    if (queryParams.adultcount) {
        queryObj.adultcount = {
            $gte: parseInt(queryParams.adultcount)
        }
    }

    if (queryParams.childcount) {
        queryObj.childcount = {
            $gte: parseInt(queryParams.childcount)
        }
    }

    if (queryParams.types) {
        queryObj.type = {
            $in: Array.isArray(queryParams.types) ? queryParams.types : [queryParams.types]
        }
    }

    if (queryParams.stars) {
        queryObj.starrating = {
            $in: Array.isArray(queryParams.stars) ? queryParams.stars.map((star: string) => parseInt(star)) : [parseInt(queryParams.stars)]
        }
    }

    if (queryParams.amenities) {
        queryObj.amenities = {
            $all: Array.isArray(queryParams.amenities) ? queryParams.amenities : [queryParams.amenities]
        }
    }

    if (queryParams.maxprice) {
        queryObj.pricepernight = {
            $lte: parseInt(queryParams.maxprice)
        }
    }

    return queryObj
}

router.get("/:id", [
    param("id","id is required").notEmpty()
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) res.status(400).json({message: errors.array()})
    const id = req.params.id?.toString()
    console.log(req.params)
    if (!id) throw new Error("Id doesnt exist")
    try {
        const hotel: HotelType | null = await Hotel.findOne({_id: id})
        res.json(hotel)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: `error in fetching hotel, ${error}`})
    }

})

export default router