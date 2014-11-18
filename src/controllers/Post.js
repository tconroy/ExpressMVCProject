var _ = require('underscore');
var models = require('../models');

var Post = models.Post;

var postsPage = function (req, res) {
  Post.PostModel.findByOwner(req.session.user._id, function (err, docs) {
    if (err) {
      console.log(err);
      return res.status(400).json({error: 'An error occurred'});
    }
    console.dir(docs);
    res.render('user/notes', {posts: docs});
  });
};

/**
 * Handles saving a new post to the server.
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
var savePost = function (req, res) {
  var pd = req.body.postData;
  console.log('recieved post from client: ' + pd);


  // if no body (post contents), error out.
  if ( !pd ) {
    return res.status(400).json({
      error: 'You must write a post before it can be saved. '
    });
  }

  // if request contains a postId, we're updating an existing post:
  if (pd.postId && pd.postId !== '' && pd.postId !== null) {
    var query = {"_id" : pd.postId};
    var update = {
      title: pd.title,
      contents: pd.contents,
      lastUpdated: Date.now()
    };
    Post.PostModel.findOneAndUpdate(query, update, null, function(err, post) {
      if (err) {
        return res.status(400).json({
          error: 'An error occurred updating an existing post.'
        });
      }
      res.json({postId: post.id});
      res.end();
      return;
    });
  } else {
    // new post
   // format the data for the new post
    var postData = {
      title: pd.title,
      contents: pd.contents,
      postDate: pd.postDate,
      owner: req.session.user._id
    };

    // save the new post
    var newPost = new Post.PostModel(postData);
    console.dir(newPost);
    newPost.save(function (err, post) {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: 'An error occurred saving a new post.'
        });
      }
      res.json({
        postId: post.id
      });
      res.end();
    });
  }
};

module.exports.postsPage = postsPage;
module.exports.savePost = savePost;