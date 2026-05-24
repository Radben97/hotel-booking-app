import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as apiClient from "../api-clients"
import { useAppContext } from "../contexts/AppContext"
import { Link, useNavigate } from "react-router"

export type SignInFormData = {
    email: string
    password: string
}


const SignIn = () => {
    const { register, handleSubmit,formState: {
        errors
    } } = useForm<SignInFormData>()
    const { showToast } = useAppContext()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const mutation = useMutation({
        mutationFn: apiClient.signIn,
        onSuccess: async () => {
            navigate("/")
            await queryClient.invalidateQueries({ queryKey: ["validateToken"] })
            showToast({ message: "Logged In", type: "SUCCESS" })
        },
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"})
        }
    })

    const submitHandler = handleSubmit((data: SignInFormData) => {
        mutation.mutate(data)
    })
    
    return (
    <form  className="flex flex-col gap-5" onSubmit={submitHandler}>
            <h2 className="text-3xl font-bold ">Sign In</h2>
        <label className="text-gray-700 text-sm font-bold flex-1">
                  Email
                  <input type="email" className="border-2
                  border-blue-500 rounded w-full py-1 px-2 font-normal" {...register("email", { required: "This field is required" })} />
              {errors.email && (
                      <span className="text-red-500">{errors.email.message}</span>
                  )}
              </label>
              <label className="text-gray-700 text-sm font-bold flex-1">
                  Password
                  <input type="password" className="border-2
                  border-blue-500 rounded w-full py-1 px-2 font-normal" {...register("password", {
                      required: "This field is required",
                      minLength: {
                          value: 8,
                          message: "Password must be atleast 8 charecters"
                      }
                  })} />
              {errors.password && (
                      <span className="text-red-500">{errors.password.message}</span>
                  )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                   Not Registered? <Link to="/register" className="underline">Create an account here</Link>
                </span>
                  <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl" type="submit">
                      Log In
                  </button>
              </span>
    </form>
  )
}

export default SignIn