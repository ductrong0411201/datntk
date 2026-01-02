const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const permissionsRouter = require('./routes/permissions');
const subjectsRouter = require('./routes/subjects');
const paymentMethodsRouter = require('./routes/paymentMethods');
const paymentsRouter = require('./routes/payments');
const courcesRouter = require('./routes/cources');
const documentsRouter = require('./routes/documents');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigin === "*" || allowedOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', rolesRouter);
app.use('/', permissionsRouter);
app.use('/', subjectsRouter);
app.use('/', paymentMethodsRouter);
app.use('/', paymentsRouter);
app.use('/', courcesRouter);
app.use('/', documentsRouter);

const { sendError } = require('./src/utils/response');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const statusCode = err.status || 500;
  const message = err.message || "Lỗi máy chủ";
  
  return sendError(res, statusCode, message);
});

module.exports = app;
