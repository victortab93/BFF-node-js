const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');

const env = proccess.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}`});

const app = express();

const redisClient = redis.createClient({
    host: proccess.env.REDIS_HOST || 'localhost',
    port: proccess.env.REDIS_PORT || 6379
});

app.use(cors({ origin: `${process.env.FRONTEND}`, credentials : true}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
    store: new RedisStore({ client: redisClient}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 3600000, // 1 hour
    } 
}));

app.use('/auth', authRoutes);

connectDB();

module.exports = app;