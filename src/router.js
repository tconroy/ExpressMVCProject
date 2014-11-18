/**
 * INCLUDES
 */
var controllers = require('./controllers'),
    mw          = require('./middleware');


/**
 * ROUTER DEFINITION
 * @param  {App}  app reference to main application
 */
var router = function(app) {
  // --- /GET
  app.get("/",
    mw.requiresSecure,
    mw.requiresLogout,
    controllers.User.loginPage);

  app.get("/login",
    mw.requiresSecure,
    mw.requiresLogout,
    controllers.User.loginPage);

  app.get("/register",
    mw.requiresSecure,
    mw.requiresLogout,
    controllers.User.registerPage);

  app.get("/logout",
    mw.requiresLogin,
    controllers.User.logout);

  app.get("/dashboard",
    mw.requiresSecure,
    mw.requiresLogin,
    controllers.User.dashboardPage);

  app.get("/notes",
    mw.requiresSecure,
    mw.requiresLogin,
    controllers.Post.postsPage);

  // --- /POST
  app.post("/login",
    mw.requiresSecure,
    mw.requiresLogout,
    controllers.User.login);

  app.post("/register",
    mw.requiresSecure,
    mw.requiresLogout,
    controllers.User.register);

  // app.post("/notes",
  //   mw.requiresSecure,
  //   mw.requiresLogout,
  //   controllers.Post.savePost);
  app.post("/notes",
    mw.requiresLogin,
    controllers.Post.savePost);
};

/**
 * EXPORTS
 */
module.exports = router;