import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import httpStatus from 'http-status';
import morgan from './config/morgan';
import config from './config';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import routes from './routes';
import swaggerOptions from './docs/swaggerDef';

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app: Express = express();

// if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// it shows the real origin IP in the heroku or Cloudwatch logs
app.enable('trust proxy');

// enable CORS - Cross Origin Resource Sharing
app.use(cors());
app.options('*', cors());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable logging
app.use(morgan.successHandler);
app.use(morgan.errorHandler);

// v1 api routes
app.use('/v1', routes);

if (config.env === 'development') {
  console.log({ config });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
}

// send back a 404 error for any unknown api request
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app; 