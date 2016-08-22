var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('localhost');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* ROUTERS */
//var errorRouter = require('./server/routes/errorRouter.js');
//app.use("/error", errorRouter);
var showRouter = require('./server/routes/showRouter.js');
app.use("/api/shows", showRouter);
var userRouter = require('./server/routes/userRouter.js');
app.use("/api/user", userRouter);
// redirect any url not covered by above routes to the home page
app.get('*', function(req, res){
  res.redirect('/#' + req.originalUrl);
});
// error handling for routes (when next is called, it uses this function)
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, {
    message: err.message
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
