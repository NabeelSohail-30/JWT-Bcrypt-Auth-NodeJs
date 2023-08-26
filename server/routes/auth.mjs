
import express from 'express';
import jwt from 'jsonwebtoken';
import {
    stringToHash,
    varifyHash
} from "bcrypt-inzi";
import { client } from '../db.mjs';

const router = express.Router();
const col = client.db("sample_airbnb").collection("listingsAndReviews");

router.post('/login', async (req, res, next) => {
    // login logic
    if (!(req.body.email || req.body.password)) {
        res.status(400).json({ message: 'Please fill in all fields' })
    }
    else {
        req.body.email = req.body.email.toLowerCase();

        try {
            let result = await userCollection.findOne({ email: req.body.email });
            console.log("result: ", result);

            if (!result) {
                res.status(400).json({ message: 'User does not exist' })
            }
            else {
                // compare password
                let isPasswordValid = await varifyHash(req.body.password, result.password);
                if (!isPasswordValid) {
                    res.status(400).json({ message: 'Invalid password' })
                }
                else {
                    // generate token
                    let token = jwt.sign({
                        id: result._id,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: result.email,
                        isAdmin: false,
                    }, 'SECRET', { expiresIn: '24h' });

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: true,
                    });
                    
                    res.status(200).json({ message: 'Login successful', token: token })
                }
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }
})

router.post('/register', async (req, res, next) => {
    // register logic
    if (!(req.body.firstName || req.body.lastName || req.body.email || req.body.password)) {
        res.status(400).json({ message: 'Please fill in all fields' })
    } else {
        req.body.email = req.body.email.toLowerCase();
        try {
            let result = await userCollection.findOne({ email: req.body.email });
            console.log("result: ", result);

            if (result) {
                res.status(400).json({ message: 'User already exists' })
            } else {
                // hash password
                req.body.password = await stringToHash(req.body.password);
                // save user
                result = await userCollection.insertOne(
                    {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: req.body.password,
                        createdOn: new Date(),
                    }
                );
                // return success message
                res.status(200).json({ message: 'User created successfully' })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }
})

export default router;