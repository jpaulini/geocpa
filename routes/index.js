var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Geo CPA',
                        pageTestScript:'/qa/tests-main.js' });
});

module.exports = router;
