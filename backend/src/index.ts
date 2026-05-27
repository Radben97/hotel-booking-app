import express, {type Request, type Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js'
import hotelRoutes from './routes/my-hotels.js'
import cookieParser from "cookie-parser"
import path from 'path';
import {v2 as cloudinary} from "cloudinary"

const mongo_uri: string = process.env.MONGODB_CONNECTION_STRING as string
mongoose.connect(mongo_uri)
    .then(() => console.log("connected to database: ", process.env.MONGODB_CONNECTION_STRING));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string
})

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.static(path.join(import.meta.dirname, "../../frontend/dist")))

app.use("/api/auth",authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/my-hotels",hotelRoutes)

app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"))
})

app.listen(7000,  () => {
    console.log("Server is running on port 7000");
})