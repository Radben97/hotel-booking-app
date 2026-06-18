
import {RegisterFormData} from "./pages/Register"
import { SignInFormData } from "./pages/SignIn"
import { HotelType } from "../../backend/src/shared/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""
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