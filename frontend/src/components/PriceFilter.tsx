
type priceFilterProps = {
    selectedPrice?: number,
    onChange: (value: number | undefined) => void
}

const PriceFilter = ({selectedPrice,onChange}: priceFilterProps) => {
  return (
      <div>
          <h4 className="text-md font-semibold mb-2">Max Price</h4>
          <select className="rounded w-full p-2" value={selectedPrice} onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}>
              <option className="">Select Max Price</option>
              {[30000, 50000, 75000, 100000].map((price) => {
                  return (
                      <option value={price} className="">{price}</option>
                  )
              })}
          </select>
    </div>
  )
}

export default PriceFilter