const Movie = require('../models/movies');
const BadRequestError = require('../errors/bad-request-error');
const ServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createMovie = (req, res, next) => {
  const {
    nameRU,
    nameEN,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
  } = req.body;
  Movie.create({
    nameRU,
    nameEN,
    movieId,
    thumbnail,
    trailerLink,
    image,
    description,
    year,
    duration,
    director,
    country,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка, неверный запрос'));
      } else {
        next(new ServerError('Произошла ошибка на стороне сервера'));
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      movies.sort((a, b) => b.createdAt - a.createdAt);
      res.send({ data: movies });
    })
    .catch(() => next(new ServerError('Произошла ошибка на стороне сервера')));
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (movie) {
        if (movie.owner.toString() === userId.toString()) {
          Movie.deleteOne(movie)
            .then(() => {
              res.send({ data: movie });
            });
        } else {
          next(new ForbiddenError('нельзя удалить фильи, который Вы не добавляли'));
        }
      } else {
        next(new NotFoundError('Фильм не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка, неверный запрос'));
      } else {
        next(new ServerError('Произошла ошибка на стороне сервера'));
      }
    });
};
