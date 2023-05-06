const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production';

const routes = require('./routes');

const app = express();

app.use(morgan('dev')); // logs info about requests and responses
app.use(cookieParser()); // parses cookies
app.use(express.json()); // parses json bodies of requests w/ Content-Type of application/json

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);
// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
);

app.use(routes);

module.exports = app;
