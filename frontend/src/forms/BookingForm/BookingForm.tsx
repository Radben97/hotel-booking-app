import { useForm } from "react-hook-form"
import { paymentOrderResponse, UserType } from "../../../../backend/src/shared/types"
import { useSearchContext } from "../../contexts/SearchContext"
import { useNavigate, useParams } from "react-router"
import * as apiClient from "../../api-clients"
import { useMutation } from "@tanstack/react-query"
import { useAppContext } from "../../contexts/AppContext"
import { useState } from "react"

type BookingFormProps = {
    currentUser: UserType,
    paymentData: paymentOrderResponse
}

export type BookingFormData = {
    firstName: string,
    lastName: string,
    email: string,
    checkIn: string,
    checkOut: string,
    adultcount: number,
    childcount: number,
    hotelId: string,
    paymentOrderId: string,
    totalCost: string
}

const BookingForm = ({ currentUser, paymentData }: BookingFormProps) => {
    const { showToast } = useAppContext()
  const [formData, setFormData] = useState<BookingFormData>()
  const navigate = useNavigate()
    const { mutate:book } = useMutation({
    mutationFn: (formData: BookingFormData) =>
      apiClient.createBooking(formData),
        onSuccess: () => {
          showToast({ message: "Hotel booked successfully", type: "SUCCESS" })
          navigate("/")
    },
        onError: () => {
        showToast({message: "Hotel booking failed, Your money will be refunded in 2-3 business days",type:"ERROR"})
    },
  });
    const { mutate } = useMutation({
    mutationFn: ({
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    }: any) =>
      apiClient.verifyPayment({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
        onSuccess: () => {
          book(formData!)
      },
        onError: () => {
        showToast({message: "Invalid payment Order",type:"ERROR"})
    },
  });
    const handlePayment = (formData: BookingFormData,e:any) => {
    var options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: paymentData!.totalCost,
      currency: "INR",
      name: "Holidays.com",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: paymentData?.paymentOrderId, 
        handler: function (response: any) {
          setFormData(formData)
        mutate({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        });
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    console.log("this rzpl, ", rzp1);
    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
        e.preventDefault();
        console.log("Options: ",options)
  };
    const search = useSearchContext()
    const {hotelId} = useParams()
    const { register,handleSubmit } = useForm<BookingFormData>({
        defaultValues: {
            firstName: currentUser.firstname,
            lastName: currentUser.lastname,
            email: currentUser.email,
            checkIn: search.checkIn.toISOString(),
            checkOut: search.checkOut.toISOString(),
            adultcount: search.adultCount,
            childcount: search.childCount,
            hotelId: hotelId,
            paymentOrderId: paymentData.paymentOrderId,
            totalCost: paymentData.totalCost
        }
    })
  return (
      <form className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5" onSubmit={handleSubmit(handlePayment)}>
          <span className="text-3xl font-bold">Confirm Your Details</span>
          <div className="grid grid-cols-2 gap-6">
              <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                  First Name
                  <input type="text" className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("firstName")} />
              </label>
              <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                  Last Name
                  <input type="text" className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("lastName")} />
              </label>
              <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
                  Email
                  <input type="text" className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal" readOnly disabled {...register("email")} />
              </label>
          </div>
          <div className="space-y-2">
              <h2 className="text-xl font-semibold">Your Price Summary:</h2>
              <div className="bg-blue-200 p-4 rounded-md">
              <div className="font-semibold text-lg">
                  Total Cost: ₹{paymentData.totalCost}
              </div>
              <div className="text-xs">Includes taxes and charges</div>
          </div>
          </div>
          <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Pay</button>

    </form>
  )
}

export default BookingForm