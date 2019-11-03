var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if (process.env.NODE_ENV !== "test") {  
  app.use(logger("dev"))
}
app.use('/', routes);


//Our Custom Routes
app.get('/users', users.findAll);
app.get('/users/:username', users.findOne);
app.get('/posts', posts.findAllPosts);
app.get('/posts/:id', posts.findOnePost);
app.post('/reg', users.register);
app.post('/log', users.login);
app.post('/posts', posts.writePosts);
app.put('/users/:username/followed', users.incrementFollowed);
app.put('/posts/:id/likes', posts.incrementLikes);
app.delete('/deleteUser/:id', users.deleteUser);
app.delete('/deletePost/:id', posts.deletePost);




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
