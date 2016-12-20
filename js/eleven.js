;(function () {

  $('.nav-mobile__burger').on('click', function () {
    $('.nav-mobile').toggleClass('nav-mobile--opened');
  });

  var iframeContainer = $('.iframe-resize');
  var history = $('.event-history');
  var chat = $('.layout-chat');

  function resize() {
    iframeContainer.each(function(i,e){
      var iframe = $(e).find('iframe');
      var ratio;
      if (!iframe.attr('data-ratio')) {
        var width = parseInt(iframe.attr('width'));
        var height = parseInt(iframe.attr('height'));
        ratio = width / height;
        iframe.attr('data-ratio', ratio);
      }
      iframe.attr('width', '100%');
      iframe.attr('height', parseInt(iframe.width()) / iframe.attr('data-ratio'));
    });

    $('.event-history__container').each(function(i, e){
      var container = $(e);
      var width = container.width();
      if (width > document.documentElement.clientWidth) {
        container.width(history.width());
      }
      else {
        container.removeAttr('style');
      }
    });

    calcChatHeight();
  }

  resize();

  $(window).resize($.throttle(250, resize));
  $(window).scroll($.throttle(250, calcChatHeight));

  window.addEventListener('load', function () {
    createVK();
    calcChatHeight();
  });

  function calcChatHeight() {
    var chatHeight;
    if (document.documentElement.clientWidth >= 1024) {
      var h = parseInt($('.content-video').height()) + parseInt($('.content-audio').height()) + parseInt($('.content-events').height());
      if (h > document.documentElement.clientHeight) {
        chatHeight = h;
      }
      else {
        chatHeight = document.documentElement.clientHeight - 76;
      }
    }
    else {
      chatHeight = document.documentElement.clientHeight;
    }
    chat.height(chatHeight);
  }

  function createVK() {
    var vk = document.createElement('script');
    document.body.appendChild(vk);
    vk.onload = function () {
      initVK();
    };
    vk.src = '//vk.com/js/api/openapi.js?136';
  }

  function initVkWidgetAuth() {
    //toggleVkWidget('.comments', false);
    //toggleVkWidget('.auth', true);
    //VK.init({apiId: 5250336});
    VK.Widgets.Auth("vk_auth", {
      width: "auto", onAuth: function (data) {
        //alert('user ' + data['first_name'] + ' ' + data['last_name'] + ' authorized');
        window.location.href = 'http://11thradio.com';
        window.location.reload();
      }
    });
  }

  function initVkWidgetComments() {
    //toggleVkWidget('.comments', true);
    //toggleVkWidget('.auth', false);
    //VK.init({apiId: 5250336, onlyWidgets: true});
    VK.Widgets.Comments("vk_comments", {
      limit: 100,
      attach: "*",
      autoPublish: 0
    });
  }

  // function initVkWidgetGroups() {
  // 	VK.Widgets.Subscribe("vk_groups", {mode: 2}, -113031536);
  // }

  function initVK() {
    VK.init({apiId: 5786458, onlyWidgets: true});

    VK.Auth.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        initVkWidgetComments();
      }
      else {
        initVkWidgetAuth();
      }
    });

    // initVkWidgetGroups();
  }

  // function toggleVkWidget(className, show) {
  //   var comments = document.querySelector(className);
  //   if (typeof show === 'undefined') {
  //     show = true;
  //   }
  //   if (show) {
  //     comments.style.display = 'block';
  //   }
  //   else {
  //     comments.style.display = 'none';
  //   }
  // }

  var trackInfo = document.querySelector('.track-info__name');

  setInterval(function (getTrackName){
    try {
      getTrackName();
    } catch (e) {
      console.log(e);
    }
  }, 20000, getTrackName);

  getTrackName();

  function getTrackName() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://11thradio.com:8011/status-json.xsl', true);
    xhr.send();
    xhr.onreadystatechange = function(){
      if (xhr.readyState != 4) return;
      if (xhr.status != 200) {
        console.log(xhr.status + ': ' + xhr.statusText);
      }
      else {
        var data = JSON.parse(xhr.responseText);
        trackInfo.textContent = data.icestats.source[0].title;
      }
    };
  }

  var toggle = $('.controls__toggle');
  var player = $('.player');
  $('.play, .stop').on('click', function () {
    if (!toggle.hasClass('controls__toggle--stopped')) {
      player.attr('src', '');
      toggle.addClass('controls__toggle--stopped');
    }
    else {
      player.attr('src', 'http://11thradio.com:8011/wavetactics192kbps.mp3');
      toggle.removeClass('controls__toggle--stopped');
    }
  });

})();