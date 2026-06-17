import { Link } from "react-router";
import { buttonStyle } from "../forms/manageHotelForm/ManageHotelForm";
import { useQuery } from "@tanstack/react-query";
import { getMyHotels } from "../api-clients";
import { HotelType } from "../../../backend/src/shared/types";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiBed, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { data, isError } = useQuery<HotelType[]>({
    queryKey: ["fetchMyHotels"],
    queryFn: getMyHotels,
  });
  if (isError) {
  }
  return (
    <div className="flex flex-col gap-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link to={"/add-hotel"} className={buttonStyle}>
          Add Hotel
        </Link>
      </span>
      {(!data || data.length === 0) && <div>No hotel found</div>}
      {data &&
        data.length > 0 &&
        data.map((hotel) => {
          return (
            <div className="flex flex-col justify-between border border-slate-300 rounded-lg p-5 gap-5">
              <h2 className="text-2xl font-bold">{hotel.name}</h2>
              <p className="whitespace-pre-line">{hotel.description}</p>
              <div className="grid grid-cols-5 gap-2">
                <div className="flex items-center border border-slate-300 p-3 text-xs">
                  <BsMap className="mr-1" />
                  {hotel.city}, {hotel.country}
                </div>
                <div className="flex items-center border border-slate-300 p-3 text-xs">
                  <BsBuilding className="mr-1" />
                  {hotel.type}
                </div>
                <div className="flex items-center border border-slate-300 p-3 text-xs">
                  <BiMoney className="mr-1" />₹{hotel.pricepernight} price per night
                </div>
                <div className="flex items-center border border-slate-300 p-3 text-xs">
                  <BiBed className="mr-1" />
                  {hotel.adultcount} adults, {hotel.childcount} children
                </div>
                <div className="flex items-center border border-slate-300 p-3 text-xs">
                  <BiStar className="mr-1" />
                  {hotel.starrating} star rating
                </div>
                  </div>
                  <span className="flex justify-end">
                      <Link to={`/my-hotel/${hotel._id}`} className={buttonStyle}>View More</Link>
                  </span>
                  
            </div>
          );
        })}
    </div>
  );
};

export default MyHotels;
