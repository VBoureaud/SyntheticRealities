const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const config = require('../config');


const getHome = catchAsync(async (req, res) => {
  const data = 'Hello from WhoMadeThis';

  res.status(httpStatus.OK).send({ data });
});

module.exports = {
  getHome,
};