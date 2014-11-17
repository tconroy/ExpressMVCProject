/**
 * Includes
 */
var models = require('../models');

/**
 * Create User Instance
 */
var User = models.User;

/**
 * GET /login
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var loginPage = function(req, res) {
  res.render('user/login');
};
/**
 * GET /register: handles
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var registerPage = function(req, res) {
  res.render('user/register');
};
/**
 * GET /dashboard
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var dashboardPage = function(req, res) {
  res.render('user/dashboard');
};



/**
 * POST /logout: handles user logout
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var logout = function(req, res) {
  req.session.destroy();
  res.redirect('/');
}
/**
 * POST /login: Handles user login
 * @param  {[type]} req [description]
 * @param  {[type]} es  [description]
 * @return {[type]}     [description]
 */
var login = function(req, res) {
  var un = req.body.username;
  var pw = req.body.password;

  if ( !un || !pw ) {
    return res.status(400).json({
      error: "All fields are required."
    });
  };
  User.UserModel.authenticate(un, pw, function(err, user) {
    if (err || !user) {
      return res.status(401).json({
        error: "Either the username or password provided is incorrect."
      });
    };
    req.session.user = user.toAPI();
    res.json({redirect: '/dashboard'});
  });
};

/**
 * POST /register: Handles user registration
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var register = function(req, res) {
  if (!req.body.username || !req.body.email || !req.body.password || !req.body.password2) {
    return res.status(400).json({error: "All fields are required."});
  };
  if (req.body.password !== req.body.password2) {
    return res.status(400).json({error: "Passwords do not match."});
  };
  User.UserModel.generateHash(req.body.password, function(salt, hash) {
    var userData = {
      username: req.body.username,
      email: req.body.email,
      salt: salt,
      password: hash
    };
    var newUser = new User.UserModel(userData);
    newUser.save(function(err) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: 'An error registering has occurred.'
        });
      };
      req.session.user = newUser.toAPI();
      res.json({redirect: '/dashboard'});
    });
  });
};

/**
 * User Controller Exports
 */
module.exports.loginPage     = loginPage;
module.exports.registerPage  = registerPage;
module.exports.dashboardPage = dashboardPage;
module.exports.login         = login;
module.exports.logout        = logout;
module.exports.register      = register;
