//Azure set up
var azure = require('azure-storage');
var nconf = require('nconf');
nconf.env()
     .file({ file: 'config.json', search: true });
var tableName = nconf.get("TABLE_NAME");
var partitionKey = nconf.get("PARTITION_KEY");
var accountName = nconf.get("STORAGE_NAME");
var accountKey = nconf.get("STORAGE_KEY");
var cookieSecret = nconf.get("COOKIE_SECRET");

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
var hbs = require('hbs');


hbs.registerHelper('section', function(name, options) {
   if(!this._sections) this._sections= {};
   this._sections[name] = options.fn(this);
   return null;
});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')());

app.use(function(req,res,next){
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.use(function(req, res, next) {
  res.locals.showTests = app.get('env') !== 'production' && req.query.test ==='1';
  next();
});

app.use('/', routes);
var CPAList = require('./routes/cpalist');
var CPA = require('./models/cpa-model.js');
var cpa = new CPA(azure.createTableService(accountName, accountKey), tableName, partitionKey);
var cpaList = new CPAList(cpa);

app.get('/list', cpaList.show.bind(cpaList));
app.post('/add', cpaList.add.bind(cpaList));
app.post('/verify', cpaList.verify.bind(cpaList));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
