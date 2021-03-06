var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
let {PythonShell} = require('python-shell')
var logger = require('morgan');
var cors = require('cors');
var querystring = require('querystring');

var pythonRouter = require('./routes/python');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);
app.use("/pythonAPI", pythonRouter)

app.get('/plants', (req, res) => {
  var state = req.query.state;
  var invasive = req.query.invasive;
  var protein = req.query.protein;

  console.log(invasive)

  var options = {
    mode: 'text',
    pythonPath: '/anaconda3/bin/python',
    scriptPath: '../py/',
    args: [state, invasive, protein]
  };

  PythonShell.run('wrangle_data.py', options, function (err, results ) {
    if (err) throw err;
    res.json(results)
  });


});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});




// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
