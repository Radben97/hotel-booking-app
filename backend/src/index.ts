import express, {type Request, type Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js'
import cookieParser from "cookie-parser"
import path from 'path';

const mongo_uri: string = process.env.MONGODB_CONNECTION_STRING as string
mongoose.connect(mongo_uri)
    .then(() => console.log("connected to database: ", process.env.MONGODB_CONNECTION_STRING));

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

app.listen(7000,  () => {
    console.log("Server is running on port 7000");
})