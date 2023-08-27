import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log(err);
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Mongoose is connected');
}
);

db.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
}
);

db.on('disconnected', () => {
    console.log('Mongoose is disconnected');
}

);

process.on('SIGINT', () => {
    db.close(() => {
        console.log('Mongoose is disconnected due to application termination');
        process.exit(0);
    });
})