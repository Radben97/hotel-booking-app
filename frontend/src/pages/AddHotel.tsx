import { useMutation } from "@tanstack/react-query"
import ManageHotelForm from "../components/ManageHotelForm"
import { useAppContext } from "../contexts/AppContext"
import { useNavigate } from "react-router"
import * as apiClient from "../api-clients"

const AddHotel = () => {
  const { showToast } = useAppContext()
   const navigate = useNavigate()
  const {mutate,isPending} = useMutation({
        mutationFn: (formData: FormData) => apiClient.addHotel(formData),
        onSuccess: async () => {
            showToast({ message: "Registration Success!", type: "SUCCESS" })
            navigate("/")
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"})
        }
  })
  const onSave = (data: FormData) => {
    mutate(data)
  }
  return (
    <ManageHotelForm onSave={onSave} isLoading={isPending} />
  )
}

export default AddHotel