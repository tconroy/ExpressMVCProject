/**
 * Includes
 */
var crypto = require('crypto');
var mongoose = require('mongoose');

/**
 * Properties
 */
var UserModel,
    iterations = 10000,
    saltLength = 64,
    keyLength  = 64;

/**
 * mongoose schema for the User account
 * @type {mongoose}
 */
var UserSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    trim:     true,
    unique:   true,
    match:    /^[A-Za-z0-9_\-\.]{1,16}$/
  },
  email: {
    type:     String,
    trim:     true,
    unique:   true,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  salt: {
    type:     Buffer,
    required: true
  },
  password: {
    type:     String,
    required: true
  },
  createData: {
    type:     Date,
    default:  Date.now
  }
});

/**
 * Returns user data formatted as JSON
 * @return {Object} JSON formatted object
 */
UserSchema.methods.toAPI = function() {
  // _id is generated automatically by mongo, and will always be unique.
  return { username: this.username, _id: this._id };
};


/**
 * validates that provided password matches stored hash value
 * @param  {String}   pw        provided password
 * @param  {Function} callback  callback passthrough
 * @return {Bool}               result passed to callback
 */
UserSchema.methods.validatePassword = function(pw, callback) {
  var pass = this.password;
  crypto.pbkdf2(pw, this.salt, iterations, keyLength, function(err, hash){
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};


/*********************
 * STATIC METHODS
 ********************/

/**
 * Searches for User with provided name.
 * @param  {String}   name        name to search for.
 * @param  {Function} callback    callback passthrough.
 * @return {UserModel}            returned user object.
 */
UserSchema.statics.findByUsername = function(name, callback) {
  var search = { username: name };
  return UserModel.findOne(search, callback);
};



/**
 * Generates a hash value
 * @param  {[type]}   password [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
UserSchema.statics.generateHash = function (password, callback) {
  var salt = crypto.randomBytes(saltLength);
  crypto.pbkdf2(password, salt, iterations, keyLength, function(err, hash){
    return callback(salt, hash.toString('hex'));
  });
};


/**
 * Authenticates registered account with the server.
 * @param  {[type]}   username [description]
 * @param  {[type]}   password [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
UserSchema.statics.authenticate = function (username, password, callback) {
  return UserModel.findByUsername(username, function(err, doc) {
    if (err) {
      return callback(err);
    }
    if (!doc) {
      return callback();
    }
    doc.validatePassword(password, function(result) {
      if (result === true) {
        return callback(null, doc);
      }
      return callback();
    });
  });
};


/**
 * EXPORTS
 */
UserModel = mongoose.model('User', UserSchema);
module.exports.UserModel = UserModel;
module.exports.UserSchema = UserSchema;

