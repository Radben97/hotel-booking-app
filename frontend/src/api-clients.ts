
import {RegisterFormData} from "./pages/Register"
import { SignInFormData } from "./pages/SignIn"
import { HotelResponse, HotelType } from "../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
export type searchParamType = {
    destination?: string,
    checkIn?: string,
    checkOut?: string,
    adultCount?: string,
    childCount?: string,
    page?: string,
    types?: string[],
    amenities?: string[],
    stars?: string[],
    sortOption?: string,
    maxprice?: string
}
export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })

    const responseBody = await response.json()
    if (!response.ok) {
        throw new Error(responseBody.message)
    }

}

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    const body = await response.json()
    if (!response.ok) throw new Error(body.message)
    return body
}

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Error occured during signout");
    }

}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include"
    })
    if (!response.ok) {
        throw new Error("Token invalid")
    }
    return response.json()

}

export const addHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData
    })

    if (!response.ok) throw new Error("Something went wrong")
    return response.json()
}

export const getMyHotels = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) throw new Error("Error fetching hotels")
    return response.json()
}

export const getHotel = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${id}`, {
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) throw new Error("Error fetching hotel")
    return response.json()

}

export const updateHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: "PUT",
        credentials: "include",
        body: hotelFormData
    })
    if (!response.ok) throw new Error("Updated failed")
    return response.json()
}

export const searchHotels = async (searchParams: searchParamType): Promise<HotelResponse> => {
    const params = new URLSearchParams()
    params.append("destination",searchParams.destination || "")
    params.append("checkIn",searchParams.checkIn || "")
    params.append("checkOut",searchParams.checkOut || "")
    params.append("adultcount",searchParams.adultCount || "")
    params.append("childcount", searchParams.childCount || "")
    params.append("page", searchParams.page || "")
    params.append("sortOptions", searchParams.sortOption || "")
    params.append("maxprice", searchParams.maxprice || "")
    searchParams.stars?.forEach(star => {
        params.append("stars",star )
    });
    searchParams.types?.forEach(type => {
        params.append("types",type )
    });
    searchParams.amenities?.forEach(amenity => {
        params.append("amenities",amenity )
    });

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${params}`, {
        method: "GET",
        credentials: "include"
    })
    if (!response.ok) throw new Error("could not fetch searched hotels")
    return response.json()
    
}

export const getHotelById = async (hotelId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`)
    if (!response.ok) throw new Error("Could not fetch hotel")
    return response.json()
}