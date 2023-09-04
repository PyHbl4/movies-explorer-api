require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/moviesexplorer' } = process.env;
const app = express();
mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(routes);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
