var createError = require('http-errors');
var mimeTIE = 'text/html';
var express = require('express');
var path = require('path');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var frameguard = require('frameguard');
var logger = require('morgan');
var mimetype = require('mime-types');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.disable('x-powered-by');

// remove following line remark cuz compression() work before view engine
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev' /* options: immediate, skip, stream, combined, common, [dev], short, tiny */ ));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(frameguard());
app.use(sassMiddleware({
   src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/css'),
  debug: true,
  indentedSyntax: true, // true = .sass and false = .scss 
  sourceMap: false,
  prefix: '/css',
  outputStyle: 'expanded' // 'nested' | 'expanded' | 'compact' | 'compressed' 
}));
app.use(express.static(path.join(__dirname, 'public'),
  { dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    fallthrough: true,
    immutable: false,
    index: false,
    lastModified: true,
    maxAge: '1h',
    redirect: true,
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
      mimeTIE = mimetype.lookup(path);
      if (mimeTIE !== 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=1800');
        console.log('path: ' + path);
      }
      console.log('Current mimeTypes: ' + mimeTIE);
    }
  }
));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

/* express-generator\templates\js\app.js.ejs */
