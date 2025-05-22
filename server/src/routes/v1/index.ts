import { Router } from 'express';
import homeRoute from './home.route';
import cardRoute from './card.route';
import gameRoute from './game.route';

const router = Router();

const defaultRoutes = [
  {
    path: '/',
    route: homeRoute,
  },
  {
    path: '/cards',
    route: cardRoute,
  },
  {
    path: '/game',
    route: gameRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;