import * as apiClient from "../api-clients";
import ManageHotelForm from "../forms/manageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();

  const { data: hotel } = useQuery({
    queryKey: ["fetchHotel", hotelId],
    queryFn: () => apiClient.getHotel(hotelId ?? ""),
    enabled: !!hotelId,
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["querykey"],
    mutationFn: (data: FormData) => apiClient.updateHotel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchHotel"] });
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <div className="">
      {hotel && (
        <ManageHotelForm
          hotel={hotel}
          onSave={handleSave}
          isLoading={isPending}
        />
      )}
    </div>
  );
};

export default EditHotel;
