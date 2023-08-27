import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validateRegisterInput from "../../validation/register";
import validateLoginInput from "../../validation/login";
import User from "../../models/UserSchema";

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: passwordHash
        });

        const savedUser = await newUser.save();

        res.json({ message: "Signup successful", user: savedUser });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const payload = {
                id: user.id,
                name: user.name
            };

            jwt.sign(
                payload,
                process.env.SECRET_KEY,
                {
                    expiresIn: "24h"
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
            );
        } else {
            res.status(400).json({ message: "Password incorrect" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;