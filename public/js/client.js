"use strict";

var Client = {
  init: function () {
    $('#registerBtn').click( $.proxy(this.onRegister, this) );
    $('#loginBtn').click( $.proxy(this.onLogin, this) );

    $.proxy(this.pageHandler(window.location.pathname), this);
  },
  /**
   * fires off page-specific functionality
   * @param  {[type]} path [description]
   * @return {[type]}      [description]
   */
  pageHandler: function (path) {
    console.log(path);
    $('ul.nav').find('a[href="'+path+'"]').parent().addClass('active');
  },
  /**
   * [handleError description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  handleError: function (message) {
    $('#status').text(message);
  },
  /**
   * [sendAjax description]
   * @param  {[type]} action [description]
   * @param  {[type]} data   [description]
   * @return {[type]}        [description]
   */
  sendAjax: function (action, data) {
    $.ajax({
      cache: false,
      type: 'POST',
      url: action,
      data: data,
      dataType: 'json',
      success: function (result, status, xhr) {
        window.location = result.redirect;
      },
      error: function (xhr, status, error) {
        var messageObj = JSON.parse(xhr.responseText);
        Client.handleError(messageObj.error);
      }
    });
  },
  /**
   * [onRegister description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onRegister: function (e) {
    e.preventDefault();
    console.log('default prevented');
    if ( $('#username').val() == '' || $('#email').val() == '' || $('#password').val() == '' || $('#password2').val() == '' ) {
      Client.handleError('All fields are required.');
      return false;
    };
    if ($('#password').val() !== $('#password2').val()) {
      Client.handleError('Passwords do not match.');
      return false;
    };
    this.sendAjax( $('#form-register').attr('action'), $('#form-register').serialize());
    return false;
  },
  /**
   * [onLogin description]
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  onLogin: function (e) {
    e.preventDefault();
    if ($('#username').val() == '' || $('#password').val() == '') {
      handleError('Username or Password is empty.');
      return false;
    };
    this.sendAjax( $('#form-login').attr('action'), $('#form-login').serialize() );
  },
};

/**
 * [description]
 * @return {[type]} [description]
 */
$(function() {
  Client.init();
});