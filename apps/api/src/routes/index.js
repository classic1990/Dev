import { Router } from 'express';
import healthCheck from './health-check.js';
import moviesRouter from './movies.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/movies', moviesRouter);

    return router;
};