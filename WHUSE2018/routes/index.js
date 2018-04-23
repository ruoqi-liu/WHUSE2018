var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/lost', function (req, res, next) {
    res.render('lost', { title: 'After login' });
});

router.get('/visit', function (req, res, next) {
    res.render('visit', { title: 'After login' });
});
module.exports = router;
