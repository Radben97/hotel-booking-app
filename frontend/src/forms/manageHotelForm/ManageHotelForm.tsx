import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitySection from "./FacilitySection";
import GuestSection from "./GuestSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";

export type hotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricepernight: number;
  starrating: number;
  amenities: string[];
  imageFiles: FileList;
  imageURLs: string[];
  adultcount: number;
  childcount: number;
};

export const buttonStyle =
  "bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded disabled: bg-gray-500";

type hotelprops = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: hotelprops) => {
  const formMethods = useForm<hotelFormData>({
    defaultValues: hotel
      ? hotel
      : { imageFiles: undefined, amenities: [], imageURLs: [] },
  });
  const { handleSubmit, watch } = formMethods;

  const onSubmit = (FormDataJSON: hotelFormData) => {
    console.log(FormDataJSON);
    const formdata = new FormData();
    console.log(FormDataJSON);
    const test = watch("imageFiles");
    console.log("test", test);
    if (hotel) formdata.append("hotelId", hotel._id);
    formdata.append("name", FormDataJSON.name);
    formdata.append("city", FormDataJSON.city);
    formdata.append("country", FormDataJSON.country);
    formdata.append("description", FormDataJSON.description);
    formdata.append("type", FormDataJSON.type);
    formdata.append("pricepernight", FormDataJSON.pricepernight.toString());
    formdata.append("starrating", FormDataJSON.starrating.toString());
    formdata.append("adultcount", FormDataJSON.adultcount.toString());
    formdata.append("childcount", FormDataJSON.childcount.toString());
    FormDataJSON.amenities.forEach((amenity, index) => {
      formdata.append(`amenities[${index}]`, amenity);
    });

    Array.from(FormDataJSON.imageFiles).forEach((image) => {
      formdata.append(`imageFiles`, image);
    });
    if (FormDataJSON?.imageURLs) {
      Array.from(FormDataJSON.imageURLs).forEach((image) => {
        formdata.append(`imageURLs`, image);
      });
    }
    onSave(formdata);
  };
  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DetailsSection />
        <TypeSection />
        <FacilitySection />
        <GuestSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button type="submit" className={buttonStyle} disabled={isLoading}>
            {isLoading ? "Saving" : "Add"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
