import React from "react";
import { ReactNode, useState } from "react";

type searchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string | undefined;
  setSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string,
  ) => void;
};

const searchContext = React.createContext<searchContext | undefined>(undefined);
export const SearchContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [destination, setDestination] = useState<string>(
    sessionStorage.getItem("destination") || "",
  );
  const [checkIn, setCheckIn] = useState<Date>(
    new Date(sessionStorage.getItem("checkIn") || new Date().toISOString()),
  );
  const [checkOut, setCheckOut] = useState<Date>(
    new Date(sessionStorage.getItem("checkOut") || new Date().toISOString()),
  );
  const [adultCount, setAdultCount] = useState<number>(
    parseInt(sessionStorage.getItem("adultcount") || "1"),
  );
  const [childCount, setChildCount] = useState<number>(
    parseInt(sessionStorage.getItem("childcount") || "1"),
  );
  const [hotelId, setHotelId] = useState<string>("");
  const setSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId: string | undefined,
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (hotelId) {
      setHotelId(hotelId);
      sessionStorage.setItem("hotelId", hotelId);
    }
    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkIn.toISOString());
    sessionStorage.setItem("checkOut", checkOut.toISOString());
    sessionStorage.setItem("adultcount", adultCount.toString());
    sessionStorage.setItem("childcount", childCount.toString());
  };

  return (
    <searchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adultCount,
        childCount,
        hotelId,
        setSearchValues,
      }}
    >
      {children}
    </searchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = React.useContext(searchContext);
  console.log("inside context", context);
  return context as searchContext;
};
