import { useFormContext, useFormState } from "react-hook-form"
import { hotelFormData } from "./ManageHotelForm"
import { hotelFacilities } from "../config/hotel-options-config"


const FacilitySection = () => {
    const { register } = useFormContext<hotelFormData>()
    const {errors} = useFormState<hotelFormData>()
  return (
   <div>
         <h2 className="text-2xl font-bold mb-3 py-4">Facilities</h2>
         <div className="grid grid-cols-5 gap-2">
           {hotelFacilities.map((amenity) => (
             <label className="text-sm flex gap-1 text-gray-700" key={amenity}>
               <input
                 type="checkbox"
                 value={amenity}
                 {...register("amenities", {
                     validate: (amenities) => {
                         if (amenities && amenities.length >0) {
                             return true
                         } else {
                             return "Atleast one facility is required"
                         }
                   }
                 })}
               />
               <span>{amenity}</span>
             </label>
           ))}
         </div>
         {errors.amenities && (
           <span className="text-red-500 text-sm font-bold">
             {errors.amenities.message}
           </span>
         )}
       </div>
  )
}

export default FacilitySection