const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/signin');
  }

  const userId = req.user.id;

  Promise.all([
    knex('tasks').where({ user_id: userId }).select('*'),
    knex('tasks').where({ user_id: userId }).count({ count: '*' }).first(),
  ])
    .then(function ([tasks, countResult]) {
      res.render('mypage', {
        title: 'My Page',
        isAuth: true,
        user: req.user,
        todos: tasks,
        taskCount: Number(countResult && countResult.count ? countResult.count : 0),
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('mypage', {
        title: 'My Page',
        isAuth: true,
        user: req.user,
        errorMessage: [err.sqlMessage || err.message],
      });
    });
});

module.exports = router;
