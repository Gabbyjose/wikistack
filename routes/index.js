const express = require('express');
const models = require('../models');
const wikiRoutes = require('./wiki.js');
const userRoutes = require('./user.js');

const router = express.Router();


router.get('/', function(req, res, next){
  models.Page.findAll({})
    .then(function (foundPages) {
      res.render('index', {pages: foundPages});
    })
    .catch(next);
});

router.use('/wiki', wikiRoutes);
router.use('/users', userRoutes);

module.exports = router;
