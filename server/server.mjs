import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { decode } from 'punycode';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'

import authRouter from './routes/auth.mjs';
import { client } from './db.mjs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello Welcome to Server World!'
    });
})


app.use(cookieParser());

app.use('/auth', authRouter);

app.use((req, res, next) => {
    let token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' })
    }
    else {
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Unauthorized' })
            }
            else {
                req.user = decoded;
                next();
            }
        })
    }
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})