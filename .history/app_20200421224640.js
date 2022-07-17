const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const cartographyRouter = require('./routes/cartography');
const demographicsRouter = require('./routes/demographics');
const placesRouter = require('./routes/places');
const boundsRouter = require('./routes/boundaries')
const dataRouter = require('./routes/data')
const subwayRouter = require('./routes/subways')
const userRouter = require('./routes/users')
const locationsRouter = require('./routes/locations')
const listingsRouter = require('./routes/listings')
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/places', placesRouter)
app.use('/demo', demographicsRouter)
app.use('/cart', cartographyRouter)
app.use('/bounds', boundsRouter)
app.use('/data', dataRouter)
app.use('/subways', subwayRouter)
app.use('/users', userRouter)
app.use('/locations', locationsRouter)
app.use('/listings', listingsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
