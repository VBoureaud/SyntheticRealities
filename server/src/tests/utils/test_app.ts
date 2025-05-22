import express from 'express';
import routes from '../../routes/v1';
import { errorConverter, errorHandler } from '../../middlewares/error';

const app = express();

app.use(express.json());
app.use('/v1', routes);
app.use(errorConverter);
app.use(errorHandler);

export default app;