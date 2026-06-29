export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

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
    lastupdated: Date,
    bookings: bookingType[]
}

export type HotelResponse = {
    hotels: HotelType[],
    pagination: {
        total: number,
        pageNumber: number,
        pages: number
    }
}

export type paymentOrderResponse = {
    paymentOrderId: string,
    key_id: string,
    totalCost: string
}

export type bookingType = {
    _id: string,
    userId: string,
    email:string,
    firstName: string,
    lastName: string,
    adultcount: number,
    childcount: number,
    checkIn: Date,
    checkOut: Date,
    totalCost: number
}