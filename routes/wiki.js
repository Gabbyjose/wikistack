const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

// router.get('/', function(req, res, next){
//   res.send('You\'ve reached the wiki page!!');
// });

router.get('/', function(req, res, next) {
  Page.findAll({})
  .then(function(pages){
    res.render('index', {
      pages: pages
    })
  })
});

router.post('/', function(req, res, next) {

  User.findOrCreate({
    where: {
      email: req.body.email,
      name: req.body.author
    }
  }).then(function(values){
    var user = values[0];

    var page = Page.build(req.body);

    return page.save()
      .then(function (page) {
        return page.setAuthor(user);
      })

  })
  .then(function(savedPage){
    res.redirect(savedPage.route);
  })
  .catch(next);

});

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/:urlTitle', function(req, res, next){
  Page.findOne({
      where: {
        urlTitle: req.params.urlTitle
      }
    })
    .then(function(foundPage){
      if (foundPage === null) {
        res.send('Page not found');
      }
      //let locals = foundPage.dataValues;
      User.findById(foundPage.authorId).then(function(user){
        res.render('wikipage', {
          author: user.name,
          title: foundPage.dataValues.title,
          content: foundPage.dataValues.content
        });
      });
      // res.render('wikipage', locals);
    })
    .catch(next);
})


// Working code! Don't delete!!

// router.get('/:urlTitle', function (req, res, next) {
//     Page.findOne({
//       where: {
//         urlTitle: req.params.urlTitle
//       }
//     })
//     .then(function(foundPage){
//       res.json(foundPage);
//     })
//     .catch(next);
// });

module.exports = router;
