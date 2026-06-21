import { HotelType } from "../../../backend/src/shared/types";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router";

const SearchHotelCard = ({ hotel }: { hotel: HotelType }) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-4 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageURLs[0]}
          alt=""
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starrating }).map(() => {
                return <AiFillStar className="fill-yellow-400" />;
              })}
            </span>
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          <Link className="text-2xl font-bold cursor-pointer" to={`/detail/${hotel._id}`}>{hotel.name}</Link>
        </div>
        <div className="line-clamp-4">{hotel.description}</div>
        <div className="grid grid-cols-2 items-end whitespace-nowrap ">
          <div className="flex gap-1 items-center">
            {hotel.amenities.slice(0, 3).map((amenity) => {
              return (
                <span className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap ">
                  {amenity}
                </span>
              );
            })}
            <span className="text-sm">
              {hotel.amenities.length > 3 &&
                `+${hotel.amenities.length - 3} more`}
            </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <span className="font-bold">{hotel.pricepernight}</span>
                      <Link className="bg-blue-600 text-white h-full p-1 font-bold text-md max-w-fit hover:bg-blue-500" to={`/detail/${hotel._id}`}>View More</Link>
                  </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHotelCard;
