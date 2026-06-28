import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import * as apiClient from "../api-clients";
import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";
import GuestForm from "../forms/GuestForm/GuestForm";

const Detail = () => {
  const {hotelId} = useParams();
  const { data: HotelData } = useQuery<HotelType>({
    queryKey: ["getHotelById"],
    queryFn: () => apiClient.getHotelById(hotelId as unknown as string),
    enabled: !!hotelId,
  });
    
  if (!HotelData) {
    return <>No data</>;
  }
  return (
    <div className="space-y-6">
      <div className="">
        <span className="flex">
          {Array.from({ length: HotelData.starrating }).map(() => {
            return <AiFillStar color="yellow" />;
          })}
        </span>
        <h1 className="text-3xl font-bold">{HotelData.name}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {HotelData.imageURLs.map((image) => {
          return (
            <div className="h-[300px]">
              <img
                src={image}
                alt={HotelData.name}
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        {HotelData.amenities.map((amenity) => {
          return (
            <div className="border border-slate-300 rounded-sm p-3">
              {amenity}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr]">
              <div className="whitespace-pre-line">{HotelData.description}</div>
              <div className="h-fit">
                  <GuestForm
          hotelId={HotelData._id}
          pricepernight={HotelData.pricepernight}
        />
              </div>
        
      </div>
    </div>
  );
};

export default Detail;
