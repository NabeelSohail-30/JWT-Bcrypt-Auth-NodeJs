import express from 'express';
import jwt from 'jsonwebtoken';
import { hash, compare } from "bcrypt-inzi"; // Assuming this is the correct import
import { connectToDatabase } from '../db.mjs';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const userCollection = db.collection("users"); // Adjust collection name accordingly

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const user = await userCollection.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: false,
        }, 'SECRET', { expiresIn: '24h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).json({ message: 'Login successful', token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const userCollection = db.collection("users"); // Adjust collection name accordingly

        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }
        else {
            const user = await userCollection.findOne({ email: email.toLowerCase() });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            else {
                const hashedPassword = await stringToHash(password);
                const newUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    createdOn: new Date(),
                };
                await userCollection.insertOne(newUser);
                return res.status(200).json({ message: 'User successfully registered' });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})