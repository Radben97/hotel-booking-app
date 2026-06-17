export type HotelType = {
    _id: string,
    userId: string
    name: string,
    city: string,
    country: string,
    description: string,
    type: string,
    pricepernight: number,
    adultcount: number,
    childcount: number,
    amenities: string[],
    starrating: number,
    imageURLs: string[],
    lastupdated: Date
}