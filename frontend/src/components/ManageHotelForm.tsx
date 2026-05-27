import { FormProvider, useForm } from "react-hook-form"
import DetailsSection from "./DetailsSection"
import TypeSection from "./TypeSection"
import FacilitySection from "./FacilitySection"
import GuestSection from "./GuestSection"
import ImagesSection from "./ImagesSection"

export type hotelFormData = {
    name: string
    city: string,
    country: string,
    description: string
    type: string
    pricepernight: number
    starrating: number
    amenities: string[]
    imageFiles: FileList
    adultcount: number
    childcount: number
}

type hotelprops = {
    onSave: (hotelFormData: FormData) => void
    isLoading: boolean
}

const ManageHotelForm = ({onSave,isLoading}: hotelprops) => {
    const formMethods = useForm<hotelFormData>()
    const { handleSubmit } = formMethods
    const onSubmit = (FormDataJSON: hotelFormData) => {
        const formdata = new FormData()
        formdata.append('name',FormDataJSON.name)
        formdata.append('city',FormDataJSON.city)
        formdata.append('country',FormDataJSON.country)
        formdata.append('description',FormDataJSON.description)
        formdata.append('type',FormDataJSON.type)
        formdata.append('pricepernight',FormDataJSON.pricepernight.toString())
        formdata.append('starrating',FormDataJSON.starrating.toString())
        formdata.append('adultcount',FormDataJSON.adultcount.toString())
        formdata.append('childcount', FormDataJSON.childcount.toString())
        FormDataJSON.amenities.forEach((amenity,index) => {
            formdata.append(`amenities[${index}]`,amenity)
        });
        Array.from(FormDataJSON.imageFiles).forEach((image) => {
            formdata.append(`imageFiles`,image)
        });
        onSave(formdata)
    }
  return (
      <FormProvider {...formMethods} >
          <form onSubmit={handleSubmit(onSubmit)}>
              <DetailsSection />
              <TypeSection />
              <FacilitySection />
              <GuestSection />
              <ImagesSection />
              <span className="flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl rounded disabled: bg-gray-500" disabled={isLoading}>
                      {isLoading ? "Saving" : "Add"}
                      </button>
              </span>
          </form>
    </FormProvider>
  )
}

export default ManageHotelForm
