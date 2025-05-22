import { Router } from 'express';
import httpStatus from 'http-status';

const router = Router();

router.get('/', (_req, res) => {
  res.status(httpStatus.OK).json({
    message: 'Welcome to the SyntheticRealities API',
    version: '1.0.0',
  });
});

export default router; 