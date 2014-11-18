var Editor = {};

Editor.init = function() {
  // add body class
  $('body').addClass('dashboard');

  // activate summernote
  $('.texteditor').summernote({
    airMode: true,
    focus: true,
    fontNames: ['Vollkorn', 'Times New Roman', 'Serif'],
    onkeyup: function(e) {
      Editor.delay(function() {
        console.log('saving...');
        Editor.savePost($('.texteditor').code());
      }, 2000);
    }
  });
  // on key up
}; // end init


/**
 * Handles delay before saving the post.
 * @return {[type]} [description]
 */
Editor.delay = (function(){
  var timer = 0;
  return function (callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms)
  };
})();

/**
 * performs an AJAX call to save the current post.
 * @return {[type]} [description]
 */
Editor.savePost = function (postCode) {
  var $form = $('#form-editor');
  // format AJAX post
  var postData = {
    title:    $form.find('#postTitle').val(),
    contents: postCode,
    postDate: $form.find('#postDate').val(),
    postId:   $form.data('postId')
  };

  // send AJAX post
  $.ajax({
    type:         'POST',
    contentType:  'application/json',
    dataType:     'json',
    url:          '/notes',
    data:         JSON.stringify({postData: postData}),
    cache:        false,
    success: function (result, status, xhr) {
      // the post ID is returned by the server. Save it as a data attribute
      // on the post form, so we can live edit the form and have it update.
      console.log('successfully saved');
      $form.data("postId", result.postId);
      Editor.onSave();
    },
    error: function (xhr, status, error) {
      Client.handleError( xhr.responseText );
    }
  });
};


/**
 * Visual confirmation, fired on successful save.
 * @return {[type]} [description]
 */
Editor.onSave = function () {
  console.log('Editor::onSave()');
  $('.texteditor-wrapper').addClass('save');
  setTimeout(function(){
    $('.texteditor-wrapper').removeClass('save');
  }, 500);
};

$(function() {
  Editor.init();
});