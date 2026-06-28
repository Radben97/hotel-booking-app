import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router";

type guestFormProps = {
  hotelId: string;
  pricepernight: number;
};

type guestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultcount: number;
  childcount: number;
};

const GuestForm = ({ hotelId, pricepernight }: guestFormProps) => {
    const search = useSearchContext();
    const { isLoggedIn } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<guestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultcount: search.adultCount,
      childcount: search.childCount,
    },
  });
  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const minDate = new Date();
  const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    const onSignInClick = (data: guestInfoFormData) => {
        search.setSearchValues("", data.checkIn, data.checkOut, data.adultcount, data.childcount)
        navigate("/sign-in", {state: {from: location}})
    }

    const onBookClick = (data: guestInfoFormData) => {
        search.setSearchValues("", checkIn, checkOut, data.adultcount, data.childcount)
        navigate(`/hotel/booking/${hotelId}`)
    }
  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">₹{pricepernight}</h3>
      <form action="" className="flex flex-col gap-4" onSubmit={isLoggedIn ? handleSubmit(onBookClick) : handleSubmit(onSignInClick)}>
        <div className="grid grid-cols-1 gap-4 items-center">
          <DatePicker
            required
            className="w-full text-md focus:outline-none p-2 h-full"
            selected={checkIn}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn || minDate}
            maxDate={maxDate}
            onChange={(date: Date | null) => setValue("checkIn", date as Date)}
            placeholderText="Check Out"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 items-center">
          <DatePicker
            required
            className="w-full text-md focus:outline-none p-2 h-full"
            selected={checkOut}
            selectsStart
            startDate={checkIn}
            endDate={checkOut}
            minDate={checkIn || minDate}
            maxDate={maxDate}
            onChange={(date: Date | null) => setValue("checkOut", date as Date)}
            placeholderText="Check Out"
          />
        </div>
        <div className="flex bg-white py-1 px-2 col-span-1 justify-between">
          <label className="flex items-center gap-1 w-1/2">
            <span className="text-sm">Adults:</span>
            <input
              type="number"
              className="text-md font-bold focus:outline-none w-full bg-transparent"
              min={1}
              max={20}
              {...register("adultcount", {
                required: "This field is required",
                min: {
                  value: 1,
                  message: "1 is the minimum input",
                },
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.adultcount && (
            <span className="text-red-500">{errors.adultcount.message}</span>
          )}
          <label className="flex items-center gap-1 w-1/2">
            <span className="text-sm">Children:</span>
            <input
              type="number"
              className="text-md font-bold focus:outline-none w-full bg-transparent"
              min={0}
              max={20}
              {...register("childcount", {
                required: "This field is required",
                min: {
                  value: 0,
                  message: "0 is the minimum input",
                },
                valueAsNumber: true,
              })}
            />
          </label>
          {errors.childcount && (
            <span className="text-red-500">{errors.childcount.message}</span>
          )}
              </div>
              <button type="submit" className="text-blue-600 bg-white px-3 font-bold hover:bg-gray-100 h-full">{isLoggedIn ? "Book Now" : "Sign In to Book"}</button>
      </form>
    </div>
  );
};

export default GuestForm;
