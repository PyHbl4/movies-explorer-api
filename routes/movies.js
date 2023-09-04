const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.number().required(),
    thumbnail: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    trailerLink: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    image: Joi.string().uri({ scheme: ['http', 'https'] }).required(),
    description: Joi.string().required(),
    year: Joi.string().required(),
    duration: Joi.number().required(),
    director: Joi.string().required(),
    country: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
