// try to pull in environment file. If not found, log exception.
try {
  require('node-env-file')('./env');
} catch (exception) {
  console.log(exception);
}

// set environement var to dev if not defined by node server.
var env = process.env.NODE_ENV || 'development',
    path = require('path'),
    url = require('url');


// static assets path for dev, test, production
var staticAssets = {
  development: {
    path: 'public/'
  },
  test: {
    path: 'public/'
  },
  production: {
    path: 'public/'
  }
};


// http url config for dev, test, production
var http = {
  development: {
    port: 3000,
    baseUrl: 'http://localhost:3000'
  },
  test: {
    port: 3000,
    baseUrl: 'http://localhost:3000'
  },
  production: {
    port: process.env.PORT || process.env.NODE_PORT || 3000,
    baseUrl: 'http://mysterious-bastion-5343.herokuapp.com'
  }
};

// mongo db config for dev, test, production.
var DB = {
  development: {
    host: 'localhost',
    database: 'dev_MVCProject'
  },
  test: {
    host: 'localhost',
    database: 'test_MVCProject'
  },
  production: {
    host: undefined, /* stored in MONGO_HQ process ENV variable for Heroku */
    database: undefined
  }
};

// redis config for dev, test, production
var redisURL = {
  hostname: 'localhost',
  port: 6379
};
var redisPASS;
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURL.auth.split(":")[1];
}
var redis = {
  development: {
    host: 'localhost',
    port: 6379,
    pass: undefined
  },
  test: {
    host: 'localhost',
    port: 6379,
    pass: undefined
  },
  production: {
    host: redisURL.hostname,
    port: redisURL.port,
    pass: redisPASS || undefined
  }
};

// set the session secret depending on environment
var sessions = {
  development: {
    secret: process.env.sessionSecret || 'Session Key'
  },
  test: {
    secret: process.env.sessionSecret || 'Session Key'
  },
  production: {
    secret: process.env.sessionSecret || 'e0c6821fddcb4b19bf38e8b9c8366d5a'
  }
};

// formatting the DB url based on env
var dburl = function () {
  var db = DB[env];
  var auth = (db.username && db.password ? db.username + ':' + db.password + '@' : '');
  var port = (db.port ? ':' + db.port : '');
  return 'mongodb://'+auth+db.host+port+'/'+db.database;
};

// function to return all the above data
var get = function () {
  return {
    env: env,
    http: http[env],
    dburl: dburl(env),
    staticAssets: staticAssets[env],
    redis: redis[env],
    sessions: sessions[env]
  };
};

// export everything out
module.exports = get();