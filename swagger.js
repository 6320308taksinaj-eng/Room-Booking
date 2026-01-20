const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Booking',
    description: 'การจัดการจองห้องพัก'
  },
  host: 'localhost:4000',
  schemes: ['http']
};

const outputFile = './swagger-output.json';
const routes = ['./src/index.js'];

swaggerAutogen(outputFile, routes, doc);