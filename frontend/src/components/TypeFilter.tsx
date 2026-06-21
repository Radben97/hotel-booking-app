import { hotelTypes } from "../config/hotel-options-config";

type typeFilterProps = {
  selectedTypes: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TypeFilter = ({selectedTypes,onChange}:typeFilterProps) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Property rating</h4>
      {hotelTypes.map((type) => {
        return (
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="rounded"
              value={type}
              checked={selectedTypes.includes(type)}
              onChange={onChange}
            />
            <span className="">{type}</span>
          </label>
        );
      })}
    </div>
  );
};

export default TypeFilter;
