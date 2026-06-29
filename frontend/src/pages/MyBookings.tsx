import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-clients";
import { HotelType } from "../../../backend/src/shared/types";

const MyBookings = () => {
  const { data: hotels } = useQuery<HotelType[]>({
    queryKey: ["getMyBookings"],
    queryFn: apiClient.getBookings,
  });
  if (!hotels || hotels.length === 0) {
    return <>No booking available</>;
  }
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold"></h1>
      {hotels.map((hotel) => {
        return (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr]  border-slate-300 rounded-lg p-8 gap-5">
            <div className="lg:w-full lg:h-[250px]">
              <img
                src={hotel.imageURLs[0]}
                alt=""
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
              <div className="text-2xl font-bold">
                {hotel.name}
                <div className="text-xs font-normal">
                  {hotel.city},{hotel.country}
                </div>
              </div>
              {hotel.bookings.map((booking) => {
                return (
                  <div>
                    <div className="">
                      <div className="">
                        <span className="font-bold mr-2">Dates: </span>
                        <span className="">
                          {new Date(booking.checkIn).toDateString()}
                          {new Date(booking.checkOut).toDateString()}
                        </span>
                      </div>
                      <div className="">
                        <span className="font-bold mr-2">Guests: </span>
                        <span className="">
                          {booking.adultcount} adults, {booking.childcount}{" "}
                          childrens
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MyBookings;
