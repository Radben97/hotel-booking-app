import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-clients"
import { HotelType } from "../../../backend/src/shared/types"
import HomePageHotelCard from "../components/HomePageHotelCard"

const HomePage = () => {
    const { data: hotels } = useQuery<HotelType[]>({
          queryKey: ["getAllHotels"],
          queryFn: apiClient.getAllHotels
    })
    if (!hotels || hotels.length === 0) return <>No hotels found</>
    const topTwoHotels = hotels.slice(0, 2)
    const otherHotels = hotels.slice(2,)
    return (
        <div className="space-y-3">
            <h1 className="text-3xl font-bold">Latest Destinations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topTwoHotels.map((hotel) => {
                    return (
                        <HomePageHotelCard hotel={hotel} />                        
                    )
                })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {otherHotels.map((hotel) => {
                    return (
                        <HomePageHotelCard hotel={hotel} />                        
                    )
                })}
            </div>
    </div>
  )
}

export default HomePage