import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validateRegisterInput from "../../validation/register";
import validateLoginInput from "../../validation/login";
import User from "../../db/userSchema.mjs";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ email: "Email already exists" });
        } else {
            const newUser = new User({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email
            });

            const rounds = 10;
            const salt = await bcrypt.genSalt(rounds);
            const hash = await bcrypt.hash(newUser.password, salt);

            newUser.password = hash;
            const savedUser = await newUser.save();

            res.json(savedUser);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req, res) => {
    try {
        const { errors, isValid } = validateLoginInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ emailnotfound: "Email not found" });
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
                    expiresIn: '24h'
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
            );
        } else {
            res.status(400).json({ passwordincorrect: "Password incorrect" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

export default router;