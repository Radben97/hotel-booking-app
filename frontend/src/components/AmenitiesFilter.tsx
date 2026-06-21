import { hotelFacilities } from "../config/hotel-options-config";


type amenityFilterProps = {
  selectedAmenities: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const AmenitiesFilter = ({selectedAmenities,onChange}: amenityFilterProps) => {
  return (
    <div className="border-b border-slate-300 pb-5">
          <h4 className="text-md font-semibold mb-2">Property rating</h4>
          {hotelFacilities.map((amenity) => {
            return (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded"
                  value={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={onChange}
                />
                <span className="">{amenity}</span>
              </label>
            );
          })}
        </div>
  )
}

export default AmenitiesFilter