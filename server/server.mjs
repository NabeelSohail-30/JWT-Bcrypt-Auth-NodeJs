import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import './db/dbConnect.mjs';
import auth from './routes/api/auth.mjs';

const app = express();
const port = process.env.PORT || 8008;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hello Welcome to Server World!'
    });
})

app.use('/api/auth', auth);

app.listen(port, async () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});