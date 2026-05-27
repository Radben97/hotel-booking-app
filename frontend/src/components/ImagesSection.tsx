import { useFormContext, useFormState } from "react-hook-form"
import { hotelFormData } from "./ManageHotelForm"


const ImagesSection = () => {
    const { register } = useFormContext<hotelFormData>()
    const {errors} = useFormState<hotelFormData>()
  return (
      <div>
          <h2 className="text-2xl font-bold mb-3 py-4">Guests</h2>
          <div className="border rounded p-4 flex flex-col gap-4">
              <input type="file" accept="image/*" multiple className="font-normal text-gray-700 w-full" {...register('imageFiles', {
                  validate: (imageFiles) => {
                      if (imageFiles.length === 0) {
                          return "Upload atleast one image"
                      }
                      if (imageFiles.length > 6) {
                          return "You can upload atmost 6 images"
                      }
                      return true
                  }
              })} />
              {errors.imageFiles && (
           <span className="text-red-500 text-sm font-bold">
             {errors.imageFiles.message}
           </span>
         )}
          </div>
    </div>
  )
}

export default ImagesSection