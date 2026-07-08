const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const busRoutes = require('./routes/bus.routes');
const routeRoutes = require('./routes/route.routes');
const stopRoutes = require('./routes/stop.routes');
const locationRoutes = require('./routes/location.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/buses', busRoutes);
app.use('/routes', routeRoutes);
app.use('/stops', stopRoutes);
app.use('/locations', locationRoutes);

app.use(errorHandler);

module.exports = app;
