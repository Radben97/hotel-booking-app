import { HotelType } from "../../../backend/src/shared/types"

type BookingFormDetailsProps = {
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultcount: number,
    childcount: number,
    numberOfNights: number,
    hotel: HotelType
}

const BookingFormDetails = ({ checkIn, checkOut, adultcount, childcount, numberOfNights, hotel }: BookingFormDetailsProps) => {
    if (!hotel) {
        return <></>
    }
  return (
      <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
          <h2 className="text-xl font-bold">Your Booking details</h2>
          <div className="border-b py-2">
              Location:
              <div className="font-bold">{`${hotel.name},${hotel.city}, ${hotel.country}`}</div>
              <div className="flex justify-between">
                  <div className="">
                      Check-In
                      <div className="font-bold">{checkIn.toDateString()}</div>
                  </div>
                  <div className="">
                      Check-Out
                      <div className="font-bold">{checkOut.toDateString()}</div>
                  </div>
              </div>
              <div className="border-t border-b py-2">
                  Total length of stay:
                  <div className="font-bold">
                      {numberOfNights} nights
                  </div>
              </div>
              <div className="">
                  Guests
                  <div className="font-bold">{adultcount} adults & {childcount} children</div>
              </div>
          </div>
          
    </div>
  )
}

export default BookingFormDetails