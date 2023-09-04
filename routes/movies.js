const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
    thumbnail: Joi.string().pattern(/^(http|https):\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,13}(:[0-9]{1,5})?(\/.*)?$/).required(),
    trailerLink: Joi.string().pattern(/^(http|https):\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,13}(:[0-9]{1,5})?(\/.*)?$/).required(),
    image: Joi.string().pattern(/^(http|https):\/\/[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,13}(:[0-9]{1,5})?(\/.*)?$/).required(),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
