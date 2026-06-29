import { useQuery } from "@tanstack/react-query";
import * as apiClient from "../api-clients";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import BookingFormDetails from "../components/BookingFormDetails";
import { paymentOrderResponse } from "../../../backend/src/shared/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Booking = () => {
  const search = useSearchContext();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkIn.getTime() - search.checkOut.getTime()) /
        (1000 * 60 * 60 * 24);
      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);
  const { hotelId } = useParams();
  if (!hotelId) throw new Error("HotelId is required");
  const { data: paymentData } = useQuery<paymentOrderResponse>({
    queryKey: ["GetPaymentOrder",hotelId],
    queryFn: () => apiClient.createPaymentOrder({ hotelId, numberOfNights }),
    enabled: !!hotelId && numberOfNights > 0,
  });
  const { data: hotel } = useQuery({
    queryKey: ["FecthHotelForBooking"],
    queryFn: () => apiClient.getHotelById(hotelId || ""),
    enabled: !!hotelId,
  });
  const { data: currentUser } = useQuery({
    queryKey: ["FetchMe"],
    queryFn: apiClient.getMe,
  });
  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingFormDetails
        destination={search.destination}
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        adultcount={search.adultCount}
        childcount={search.childCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {currentUser && paymentData && (
        <BookingForm
          currentUser={currentUser}
          paymentData={paymentData}
        />
      )}
    </div>
  );
};

export default Booking;
