const express = require('express');
const router = express.Router();
const models = require('../models');
const User = models.User;
const Page = models.Page;

router.get('/', function(req, res, next){
  User.findAll({})
  .then(function(users){
    res.render('index', {
      users: users
    });
  });
});

//displaying a dynamic /username field that displays all of a users pages
router.get('/:username', function(req, res, next){
  User.findAll({
      where: {
        name: req.params.username
      }
    })
    .then(function(foundAuthor){
      if (foundAuthor === null) {
        res.send('Page not found');
      }
      Page.findAll({
        where: {
          authorId: foundAuthor[0].dataValues.id
        }
      })
      .then(function(pages){
        res.render('index', {
          pages: pages
        });
      });
    })
    .catch(next);
})

module.exports = router;
