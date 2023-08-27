import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
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

app.use('/auth', authRouter);

app.use((req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    });
})

// Close the database connection when the server is stopped
process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit(0);
});

app.listen(port, async () => {
    console.log(`Server is listening on port http://localhost:${port}`);
});