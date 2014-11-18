var mongoose = require('mongoose');
var _ = require('underscore');

var PostModel;

/**
 * [setTitle description]
 * @param {[type]} title [description]
 */
var setTitle = function (title) {
  return _.escape(title).trim();
};

var PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
    default: 'Untitled Note'
  },
  postDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  contents: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  }
});

/**
 * returns JSON formatted API version
 * @return {[type]} [description]
 */
PostSchema.methods.toAPI = function () {
  return {
    title: this.title,
    contents: this.contents,
    postDate: this.postDate,
    lastUpdated: this.lastUpdated,
    owner: this.owner
  };
};

PostSchema.statics.findByOwner = function (posterId, callback) {
  var search = {
    owner: mongoose.Types.ObjectId(posterId)
  };
  return PostModel.find(search).select("title contents postDate lastUpdated").exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports.PostModel = PostModel;
module.exports.PostSchema = PostSchema;