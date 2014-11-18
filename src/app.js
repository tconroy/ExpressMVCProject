// imports
var path         = require('path'),
    express      = require('express'),
    compression  = require('compression'),
    favicon      = require('serve-favicon'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose'),
    session      = require('express-session'),
    RedisStore   = require('connect-redis')(session),
    url          = require('url'),
    config       = require('./config.js'),
    router       = require('./router.js');

// define mongo url & connect
var dbURL = process.env.MONGOHQ_URL || config.dburl;
var db = mongoose.connect(dbURL, function(err) {
  if (err) {
    console.log("Could not connect to mongodb:");
    throw err;
  }
});

// define server
var server,
    port = config.http.port,
    app = express();

// configure app
app.use('/assets', express.static(path.resolve(config.staticAssets.path)));
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
  store: new RedisStore({
    host: config.redis.host,
    port: config.redis.port,
    pass: config.redis.pass
  }),
  secret: config.sessions.secret,
  resave: true,
  saveUninitialized: true
}));
app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(favicon(path.resolve(config.staticAssets.path+'/img/favicon.png')));
app.use(cookieParser());
router(app);

server = app.listen(port, function(err) {
  if(err) throw err;
  console.log('App listening on port ' + port);
});