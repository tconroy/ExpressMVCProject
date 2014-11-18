/**
 * MIDDLEWARE
 */

/**
 * Middleware -- redirects to index if no user set in sessions.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var requiresLogin = function (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};

/**
 * [requiresLogout description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var requiresLogout = function (req, res, next) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

/**
 * Middleware -- ensures HTTPS headers are set.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var requiresSecure = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://'+req.host+req.url);
  }
  next();
};

/**
 * Middleware -- bypasses HTTPS headers.
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var bypassSecure = function (req, res, next) {
  next();
};

/**
 * EXPORT MODULES
 */
/**
 * Heroku requires HTTPS. We set NODE_ENV value on the Heroku control panel.
 */
module.exports.requiresSecure = (process.env.NODE_ENV === 'production') ? requiresSecure : bypassSecure;
module.exports.requiresLogin  = requiresLogin;
module.exports.requiresLogout = requiresLogout;