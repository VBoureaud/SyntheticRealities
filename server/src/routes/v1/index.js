const config = require('../../config');
const express = require('express');
const homeRoute = require('./home.route');
const docsRoute = require('./docs.route');
const cardRoute = require('./card.route');
const gamesRoute = require('./games.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/',
    route: homeRoute,
  }, {
    path: '/card',
    route: cardRoute,
  }, {
    path: '/games',
    route: gamesRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
