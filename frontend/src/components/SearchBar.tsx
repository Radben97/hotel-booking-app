import { useNavigate } from "react-router";
import { useSearchContext } from "../contexts/SearchContext";
import { FormEvent, useState } from "react";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "../../node_modules/react-datepicker/dist/react-datepicker.css"

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();
  console.log(search);
  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn);
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut);
  const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);
    const minDate = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        search.setSearchValues(destination, checkIn, checkOut, adultCount, childCount)
        navigate("/search")
    }
  return (
    <form className="-mt-8 bg-orange-400 p-3 grid grid-cols-2 lg:grid-cols-5 rounded shadow-md gap-2 items-stretch" onSubmit={handleSubmit}>
  {/* Column 1: Destination */}
  <div className="flex items-center bg-white p-2 col-span-1">
    <MdTravelExplore size={25} className="mr-2" />
    <input
      type="text"
      className="text-md focus:outline-none w-full"
      placeholder="Where are you going?"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
    />
  </div>

  {/* Column 2: Guests */}
  <div className="flex bg-white py-1 px-2 col-span-1 justify-between">
    <label className="flex items-center gap-1 w-1/2">
      <span className="text-sm">Adults:</span>
      <input
        type="number"
        className="text-md font-bold focus:outline-none w-full bg-transparent"
        min={1}
        max={20}
        value={adultCount}
        onChange={(event) => setAdultCount(parseInt(event.target.value) || 1)}
      />
    </label>
    <label className="flex items-center gap-1 w-1/2">
      <span className="text-sm">Children:</span>
      <input
        type="number"
        className="text-md font-bold focus:outline-none w-full bg-transparent"
        min={0}
        max={20}
        value={childCount}
        onChange={(event) => setChildCount(parseInt(event.target.value) || 0)}
      />
    </label>
  </div>

  {/* Column 3: Check-In */}
  <div className="col-span-1 bg-white">
    <DatePicker 
      className="w-full text-md focus:outline-none p-2 h-full" 
      selected={checkIn} 
      selectsStart 
      startDate={checkIn} 
      endDate={checkOut} 
      minDate={minDate} 
      maxDate={maxDate} 
      onChange={(date: Date | null) => setCheckIn(date as Date)} 
      placeholderText="Check In" 
    />
  </div>

  {/* Column 4: Check-Out */}
  <div className="col-span-1 bg-white">
    <DatePicker 
      className="w-full text-md focus:outline-none p-2 h-full" 
      selected={checkOut} 
      selectsStart /* Fixed to selectsEnd */
      startDate={checkIn} 
      endDate={checkOut} 
      minDate={checkIn || minDate} /* Prevent checkout before checkin */
      maxDate={maxDate} 
      onChange={(date: Date | null) => setCheckOut(date as Date)} 
      placeholderText="Check Out" 
    />
  </div>

  {/* Column 5: Actions */}
  <div className="flex gap-1 col-span-1">
    <button type="submit" className="w-2/3 bg-blue-600 hover:bg-blue-500 text-white font-bold p-2 transition-colors rounded-sm">
      Search
    </button>
    <button type="button" className="w-1/3 bg-red-600 hover:bg-red-500 text-white font-bold p-2 transition-colors rounded-sm">
      Clear
    </button>
  </div>
</form>
  );
};

export default SearchBar;
