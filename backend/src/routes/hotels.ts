import express, { Request, Response } from "express";
import Hotel from "../models/hotel.js";
import {
  bookingType,
  HotelResponse,
  HotelType,
  paymentOrderResponse,
} from "../shared/types.js";
import { param, validationResult } from "express-validator";
import verifyToken from "../middleware/auth.js";
import Razorpay from "razorpay";
import crypto from "crypto";
const router = express.Router();
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY as string,
  key_secret: process.env.RAZORPAY_API_SECRET as string,
});

router.get("/search", async (req: Request, res: Response) => {
  console.log("--------------------");
  console.log("query", req.query);
  console.log("--------------------");
  const pageSize = 5;
  const pageNumber = req.query.page ? Number(req.query.page) : 1;
  const skip = (pageNumber - 1) * pageSize;
  const filterQuery = constructQuery(req.query);
  let sortOptions = {};
  switch (req.query.sortOptions) {
    case "starrating":
      sortOptions = { starrating: -1 };
      break;
    case "pricepernightasc":
      sortOptions = { pricepernight: 1 };
      break;
    case "pricepernightdesc":
      sortOptions = { pricepernight: -1 };
      break;
  }
  try {
    const hotels = await Hotel.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);
    const total = await Hotel.countDocuments(filterQuery);
    const response: HotelResponse = {
      hotels: hotels,
      pagination: {
        total: total,
        pageNumber: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Could not fetch all hotels" });
  }
});

const constructQuery = (queryParams: any) => {
  const queryObj: any = {};

  if (queryParams.destination) {
    queryObj.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultcount) {
    queryObj.adultcount = {
      $gte: parseInt(queryParams.adultcount),
    };
  }

  if (queryParams.childcount) {
    queryObj.childcount = {
      $gte: parseInt(queryParams.childcount),
    };
  }

  if (queryParams.types) {
    queryObj.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    queryObj.starrating = {
      $in: Array.isArray(queryParams.stars)
        ? queryParams.stars.map((star: string) => parseInt(star))
        : [parseInt(queryParams.stars)],
    };
  }

  if (queryParams.amenities) {
    queryObj.amenities = {
      $all: Array.isArray(queryParams.amenities)
        ? queryParams.amenities
        : [queryParams.amenities],
    };
  }

  if (queryParams.maxprice) {
    queryObj.pricepernight = {
      $lte: parseInt(queryParams.maxprice),
    };
  }

  return queryObj;
};

router.get(
  "/:id",
  [param("id", "id is required").notEmpty()],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.status(400).json({ message: errors.array() });
    const id = req.params.id?.toString();
    console.log(req.params);
    if (!id) throw new Error("Id doesnt exist");
    try {
      const hotel: HotelType | null = await Hotel.findOne({ _id: id });
      res.json(hotel);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `error in fetching hotel, ${error}` });
    }
  },
);

router.post(
  `/:hotelId/booking/create-payment-order`,
  verifyToken,
  async (req: Request, res: Response) => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId?.toString() || "";
    try {
      const hotel = await Hotel.findOne({ _id: hotelId });
      if (!hotel) res.status(400).json({ message: "Hotel not found" });
      const paymentOrder = await razorpayInstance.orders.create({
        amount: hotel!.pricepernight! * 100 * numberOfNights,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
          hotelId: hotelId,
          userId: req.userId,
        },
      });
      const order = await razorpayInstance.orders.fetch(paymentOrder.id);
      if (!order)
        res.status(500).json({ message: "Error creating payment order" });

      const response: paymentOrderResponse = {
        paymentOrderId: paymentOrder.id,
        key_id: process.env.RAZORPAY_API_KEY!.toString(),
        totalCost: (hotel!.pricepernight! * numberOfNights).toString(),
      };

      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating payment order" });
    }
  },
);

router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      console.log("req body",req.body)
      const hotelId = req.params.hotelId?.toString();
      if (!hotelId) res.status(500).json({ message: "Hotel id is required" });

      const paymentOrderId = req.body.paymentOrderId;
      const paymentOrder = await razorpayInstance.orders.fetch(paymentOrderId);

      if (!paymentOrder)
        return res.status(400).json({ message: "payment order not found" });
      console.log("Payment order", paymentOrder)
      console.log("hotelid", hotelId)
      console.log("userId",req.userId)
      if (
        paymentOrder!.notes!.hotelId !== hotelId ||
        paymentOrder!.notes!.userId !== req.userId
      ) {
        return res.status(400).json({ message: "order mismatch" });
      }
      const newBooking: bookingType = {
        ...req.body,
        userId: req.userId,
      };
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: hotelId!,
        },
        {
          $push: { bookings: newBooking },
        },
      );

      if (!hotel) res.status(400).json({ message: "Hotel not found" });
      res.status(200).json({message: "Hotel booked successfully"});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

router.post(
  "/verify-payment",
  verifyToken,
  async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }
    res.status(200).json({ message: "succeeded" });
  },
);

export default router;
