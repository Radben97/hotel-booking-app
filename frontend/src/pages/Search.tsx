import { useState } from "react"
import { searchParamType } from "../api-clients"
import { useSearchContext } from "../contexts/SearchContext"
import { useQuery } from "@tanstack/react-query"
import * as apiClient from "../api-clients"
import SearchHotelCard from "../components/SearchHotelCard"
import Pagination from "../components/Pagination"
import StarFilter from "../components/StarFilter"
import TypeFilter from "../components/TypeFilter"
import AmenitiesFilter from "../components/AmenitiesFilter"
import PriceFilter from "../components/PriceFilter"

const Search = () => {
    const [page, setPage] = useState<number>(1)
    const [selectedStars,setSelectedStars] = useState<string[]>([])
    const [selectedTypes,setSelectedTypes] = useState<string[]>([])
    const [selectedAmenities,setselectedAmenities] = useState<string[]>([])
    const [selectedPrice,setselectedPrice] = useState<number | undefined>()
    const [selectedSortOption,setselectedSortOption] = useState<string | undefined>()
    const search = useSearchContext()
    const searchParams: searchParamType  = {
        destination: search.destination,
        checkIn: search.checkIn.toISOString(),
        checkOut: search.checkOut.toISOString(),
        adultCount: search.adultCount.toString(),
        childCount: search.childCount.toString(),
        page: page.toString(),
        stars: selectedStars,
        types: selectedTypes,
        amenities: selectedAmenities,
        maxprice: selectedPrice?.toString(),
        sortOption: selectedSortOption
    }

    const handleStarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSelectedStars((prevState) => {
            return e.target.checked ? [...prevState,value] : prevState.filter((star) => star !== value)
        })
    }
    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSelectedTypes((prevState) => {
            return e.target.checked ? [...prevState,value] : prevState.filter((hotel) => hotel !== value)
        })
    }
    const handleAmenityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setselectedAmenities((prevState) => {
            return e.target.checked ? [...prevState,value] : prevState.filter((amenity) => amenity !== value)
        })
    }

    const { data: searchedHotels } = useQuery({
        queryKey: ["searchHotels", searchParams],
        queryFn: () => apiClient.searchHotels(searchParams)
    })
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
            <div className="rounded border border-slate-300 p-5 h-fit sticky top-5">
                <div className="space-y-5">
                    <h3 className="text-xl font-semibold border-b border-slate-300 pb-5">
                        Filter By: 
                    </h3>
                    <StarFilter selectedStars={selectedStars} onChange={handleStarChange} />
                    <TypeFilter selectedTypes={selectedTypes} onChange={handleTypeChange} />
                    <AmenitiesFilter selectedAmenities={selectedAmenities} onChange={handleAmenityChange} />
                    <PriceFilter selectedPrice={selectedPrice} onChange={(value?: number) => setselectedPrice(value)} /> 
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">
                        {searchedHotels?.pagination.total} Hotels
                        {search.destination ? `in ${search.destination}` : ""}
                    </span>
                    <select className="rounded" value={selectedSortOption} onChange={(e) => setselectedSortOption(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="starrating">star rating</option>
                        <option value="pricepernightasc">price per night (low to high) </option>
                        <option value="pricepernightdesc">price per night (high to low)</option>
                    </select>
                </div>
                  {searchedHotels?.hotels.map((hotel) => {
                      return <SearchHotelCard key={hotel._id} hotel={hotel} />
                })}
                <div>
                    <Pagination page={searchedHotels?.pagination.pageNumber || 1} pages={searchedHotels?.pagination.pages || 1} onPageChange={(page) => setPage(page)} />
                </div>
            </div>
    </div>
  )
}

export default Search