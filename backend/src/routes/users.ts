import express, {type Request, type Response} from 'express'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { check, validationResult } from 'express-validator'; 

const router = express.Router()
 
router.post("/register",[
    check("firstname", "First Name is required").isString(),
    check("lastname", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 8 })
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            message: errors.array()
        })
    }
    try {
        let user = await User.findOne({
            email: req.body.email
        })

        if (user) {
            return res.status(400).json({
                message: "User already exists"
            })
        }
        user = new User(req.body)
        await user.save()

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" })
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600000
        })
        return res.status(200).json({
            "message": "User created successfully"
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
})

export default router