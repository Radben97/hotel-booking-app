import { Link } from "react-router"
import { HotelType } from "../../../backend/src/shared/types"

type HomePageHotelCardProps = {
    hotel: HotelType
}

const HomePageHotelCard = ({hotel}: HomePageHotelCardProps) => {
  return (
      <div>
          <Link to={`/detail/${hotel._id}`} className="relative rounded-md overflow-hidden cursor-pointer">
              <div className="h-[300px]">
                  <img src={hotel.imageURLs[0]} alt="" className="w-full h-full object-cover object-center" />
              </div>
              <div className="absolute bottom-0 p-4 bg-black bg-opacity-50 w-full rounded-md">
                  <span className="text-white tracking-tight font-bold text-2xl">{hotel.name}</span>
              </div>
          </Link>
    </div>
  )
}

export default HomePageHotelCard