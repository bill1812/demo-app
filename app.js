// app.modules
const compression = require('compression');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const express = require('express');
const favicon = require('serve-favicon');
const frameguard = require('frameguard');
const logger = require('morgan');
const mimetype = require('mime-types');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const xfo = require('./bin/www');

// app.localModules
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// app.localVariable
const app = express();

// app.localLetVar
let mimeTIE = 'text/html';
// app.disable('x-powered-by');

// app.uses
app.use(compression());
app.use(logger('dev' /* options: immediate, skip, stream, combined, common, [dev], short, tiny */ ));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((req, res, next) => {
  const cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    let randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie(
      'yummyCookie',
      randomNumber,
      { maxAge: 0.5 * 60 * 60,
        httpOnly: true,
        signed: false,
        sameSite: true
      }
    );
    console.log(`\x1b[35m\x1b[1m`, ` cookie: ` + randomNumber, `\x1b[37m\x1b[0m`);
  }
  next();
});
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(frameguard({
  action: xfo.xframeorigin //,
  //domain: '',
  //domain: '',
  //domain: '',
  //domain: ''
}));
app.use(sassMiddleware({
   src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/css'),
  debug: true,
  indentedSyntax: true, // true = .sass and false = .scss 
  sourceMap: false,
  prefix: '/css',
  outputStyle: 'expanded' // 'nested' | [expanded] | 'compact' | 'compressed' 
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
    setHeaders: (res, path, stat) => {
      res.set('x-timestamp', Date.now());
      mimeTIE = mimetype.lookup(path);
      if (mimeTIE !== 'text/html') {
        res.setHeader('Cache-Control', 'public, max-age=1800');
        res.setHeader('Expires', new Date(Date.now() + 2 * 60* 60).toUTCString());
    //  console.log('path: ' + path);
      }
    //  console.log('Current mimeTypes: ' + mimeTIE);
    }
  }
));

// app.mounts
app.use('/', indexRouter);
app.use('/users', usersRouter);

// view engine setup @app.view.render

// app.view.engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  const theErr = [
    req.app.get('env'),
    res.statusCode.toString()
  ];
  // console.log('theErr[0]: ' + theErr[0] + ' theErr[1]: ' + theErr[1]);
  if (theErr[0] === 'development') {
    res.render('error');
  } else {
    res.render(theErr[1]);
  }
  next();
});

module.exports = app;

/* express-generator\templates\js\app.js.ejs */
