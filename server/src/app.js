const express =require('express');
const cors = require('cors')
const helmet  = require('helmet')
const morgan = require('morgan');
const routes = require('./routes');
const errorHandler = require('./middleware/error');



const app = express();
console.log('app is starting');
app.use(helmet())
app.use(express.json())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan("dev"))
app.use('/api', routes);
app.use(errorHandler);
module.exports = app;
