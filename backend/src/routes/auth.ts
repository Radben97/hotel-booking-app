import express, {type Request, type Response} from "express"
import { check, validationResult } from "express-validator"
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import verifyToken from "../middleware/auth.js"

const router = express.Router()

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "password with 8 or more charecters required").isLength({
        min:8
    })
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()
        })
    }
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000
        })
        res.status(200).json({userId: user.id})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Something went wrong"})
    }
})
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId})
})

router.post("/logout", (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    })
    res.send()
})
export default router