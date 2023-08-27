import dotenv from 'dotenv';
dotenv.config();

import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";

const User = mongoose.model("users");

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

const configurePassport = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.id);

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                console.error(err);
                return done(err, false);
            }
        })
    );
};

export default configurePassport;