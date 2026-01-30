require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const roomRoutes = require('./routes/room.route');
const userRoutes = require('./routes/user.route');
const bookingRoutes = require('./routes/booking.route');

app.use('/images', express.static('images'));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/rooms', roomRoutes);
app.use('/users', userRoutes);
app.use('/bookings', bookingRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to the Room Booking API');
});

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log('='.repeat(50));
});

