import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

dotenv.config();

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


app.listen(port, async () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});