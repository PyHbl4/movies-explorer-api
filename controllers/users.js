const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const ServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10, (error, hashedPassword) => {
    if (error) {
      next(new ServerError('Произошла ошибка на стороне сервера'));
      return;
    }

    User.create({
      name,
      email,
      password: hashedPassword,
    })
      .then((user) => res.status(201).send({
        data: {
          name: user.name,
          email: user.email,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Произошла ошибка, неверный запрос'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже есть в базе'));
        } else {
          next(err);
        }
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthError(err.message));
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
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

module.exports.updateInfo = (req, res, next) => {
  const update = {};

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.email) {
    update.email = req.body.email;
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    update,
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже есть в базе'));
      } else {
        next(new ServerError(err.message));
      }
    });
};
