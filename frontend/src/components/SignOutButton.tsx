import { useMutation, useQueryClient } from "@tanstack/react-query"
import * as apiClient from "../api-clients"
import { useAppContext } from "../contexts/AppContext"

const SignOutButton = () => {
    const { showToast } = useAppContext()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: apiClient.signOut,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ["validateToken"]})
            showToast({message: "Signed out",type: "SUCCESS"})
        },
        onError: (error: Error) => {
            showToast({message: error.message,type:"ERROR"})
        }
    })

    const handleClick = () => {
        mutation.mutate()
    }
    return (
        <button onClick={handleClick} className="text-blue-600 bg-white px-3 font-bold hover:bg-gray-100">Sign Out</button>
  )
}

export default SignOutButton