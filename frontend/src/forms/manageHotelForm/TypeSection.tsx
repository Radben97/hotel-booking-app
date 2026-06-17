import { useFormContext, useFormState } from "react-hook-form";
import { hotelFormData } from "./ManageHotelForm";
import { hotelTypes } from "../../config/hotel-options-config";
import { useWatch } from "react-hook-form";


const TypeSection = () => {
  const {
    register,
    control
    } = useFormContext<hotelFormData>();
    const {errors} = useFormState<hotelFormData>()

    const typeWatch = useWatch<hotelFormData>({
        control,
        name: "type"
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 py-4">Type</h2>
      <div className="grid grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label key={type}
            className={
              typeWatch === type
                ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold"
                : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
            }
          >
            <input
              type="radio"
              value={type}
              {...register("type", {
                required: "This field is required",
              })}
              className="sr-only"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;