import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';
import userRoutes from './routes/userRouters.js';
import roleRoutes from './routes/roleRouter.js';
import postRoutes from './routes/postRouters.js';
import eventRoutes from './routes/eventRouters.js';

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:3000',
        process.env.CLIENT_URL,
    ],
    credentials: true,
}));
app.use(express.json({ limit: "10kb" }));

// User api routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/users/role', roleRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/events', eventRoutes)

app.all("*", (err, req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// module.exports = {app};
export default app;