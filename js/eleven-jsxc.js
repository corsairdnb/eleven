;(function ($, $document) {

  $(main);

  function main() {
    var chat = new Chat();
    chat.init();
  }

  function Chat() {

  }

  Chat.prototype.init = function () {

    var $roster = $('#jsxc_roster');

    var settings = {
      xmpp: {
        url: '/http-bind/',
        domain: 'localhost',
        resource: 'conference',
        overwrite: true
      }
    };

    jsxc.init({
      loginForm: {
        form: '#form',
        jid: '#username',
        pass: '#password'
      },
      logoutElement: $('#logout'),
      root: '/',
      displayRosterMinimized: function() {
        return true;
      },
      loadSettings: function(username, password, cb) {
        cb(settings);
      },
      xmpp: {
        url: settings.xmpp.url
      },
      rosterAppend: '.content-chat'
    });


    jsxc.muc.join('test_room', 'admin');

    $document.on('ready.roster.jsxc', function(){
      $('#content').css('right', $roster.outerWidth() + parseFloat($roster.css('right')));
    });
    $document.on('toggle.roster.jsxc', function(event, state, duration){
      $('#content').animate({
        right: ((state === 'shown') ? $roster.outerWidth() : 0) + 'px'
      }, duration);
    });

    // $('#form2').submit(function(ev) {
    //   ev.preventDefault();
    //
    //   source = $(this);
    //   $('#submit2').button('loading');
    //
    //   jsxc.start($('#username2').val() + '@' + settings.xmpp.domain, $('#password2').val());
    // });

    jsxc.start('admin' + '@' + 'localhost', 'admin');

    // form elements which needs to be enabled/disabled
    var formElements = $('#forcm2, #form').find('input');

    $document.on('connecting.jsxc', function() {
      formElements.prop('disabled', true);
    });

    $document.on('authfail.jsxc', function() {
      formElements.prop('disabled', false);
      $(source).find('.alert').show();
      $(source).find('.submit').button('reset');
    });

    $document.on('attached.jsxc', function() {
      formElements.prop('disabled', true);
      $('.submit').hide();
      $('form .alert').hide();

      $('.logout').show().click(jsxc.xmpp.logout);
    });

    $document.on('disconnected.jsxc', function() {
      $(source).find('button').button('reset');
      formElements.prop('disabled', false);
      $('.submit').show();
      $('.logout').hide().off('click');
    });
  }

})($, $(document));