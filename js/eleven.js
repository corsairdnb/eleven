$(function () {

  $('.nav-mobile__burger').on('click', function () {
    $('.nav-mobile').toggleClass('nav-mobile--opened');
  });

  // var iframeContainer = $('.iframe-resize');
  var history = $('.event-history');
  var chat = $('.layout-chat');

  function resize() {
    // iframeContainer.each(function(i,e){
    //   var iframe = $(e).find('iframe');
    //   var ratio;
    //   if (!iframe.attr('data-ratio')) {
    //     var width = parseInt(iframe.attr('width'));
    //     var height = parseInt(iframe.attr('height'));
    //     ratio = width / height;
    //     iframe.attr('data-ratio', ratio);
    //   }
    //   iframe.attr('width', '100%');
    //   iframe.attr('height', parseInt(iframe.width()) / iframe.attr('data-ratio'));
    // });

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

  createVK();
  calcChatHeight();

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
  var coverImg = document.querySelector('.track-info__img');

  coverImg.on('error', function () {
    this.src = '/img/social.png';
  });

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
        coverImg.src = 'http://11thradio.com/coverarts/dnb/' + data.icestats.source[0].title.replace(/ /g, '_') + '.jpg';
      }
    };
  }

  var toggle = $('.controls__toggle');
  var player = $('.player');

  // if (player.paused) {
  //   player.attr('src', '');
  //   toggle.addClass('controls__toggle--stopped');
  // }

  if (isMobile.any) {
    $('html').addClass('is-mobile');
  }

  $('.play, .pause').on('click', function () {
    if (!toggle.hasClass('controls__toggle--stopped')) {
      player.attr('src', '');
      toggle.addClass('controls__toggle--stopped');
    }
    else {
      player.attr('src', 'http://11thradio.com/audiostreams/192kbps.mp3');
      toggle.removeClass('controls__toggle--stopped');
    }
  });








  var slideItems = $('.event-history__item');
  var eventTitle = $('.event-history__title');
  var eventText = $('.event-history__text');

  var eventSwiper = new Swiper('.event-history__container', {
    // wrapperClass: 'event-history__list',
    // slideClass: 'event-history__item'
    nextButton: '.event-history__next',
    prevButton: '.event-history__prev',
    slidesPerView: 7,
    onTouchStart: function (swiper) {
      swiper.container.addClass('event-history__container--animating')
    },
    onTouchEnd: function (swiper) {
      swiper.container.removeClass('event-history__container--animating')
    },
    onTap: function (swiper, event) {
      //console.log('tap');
      var item = $(event.target);
      if (!item.hasClass('event-history__item')) {
        item = item.closest('.event-history__item');
      }
      if (!item.hasClass('swiper-slide-active')) {
        swiper.slideTo(item.index());
        slideItems.removeClass('swiper-slide-active');
        item.addClass('swiper-slide-active');
      }

      var title = item.data('event-day') + ' '
        + item.data('event-month') + ' <small>('
        + item.data('event-weekday') + ')</small> '
        + item.data('event-time');
      eventTitle.html(title);
      eventText.html(item.find('.event-history__description').html());
    },
    //onSlideChangeStart: function (swiper) {
    //console.log(swiper.activeIndex);
    //console.log(slideItems.eq(swiper.activeIndex));
    //},
    onInit: function () {
      var item = slideItems.eq(0);
      var title = item.data('event-day') + ' '
        + item.data('event-month') + ' <small>('
        + item.data('event-weekday') + ')</small> '
        + item.data('event-time');
      eventTitle.html(title);
      eventText.html(item.find('.event-history__description').html());
    },
    onSlideChangeEnd: function (swiper) {
      var item = slideItems.eq(swiper.activeIndex);
      var title = item.data('event-day') + ' '
        + item.data('event-month') + ' <small>('
        + item.data('event-weekday') + ')</small> '
        + item.data('event-time');
      eventTitle.html(title);
      eventText.html(item.find('.event-history__description').html());
      //console.log(item.data('event-day'));
    },
    slideToClickedSlide: true,
    breakpoints: {
      375: {
        slidesPerView: 3
      },
      480: {
        slidesPerView: 4
      },
      667: {
        slidesPerView: 6
      }
    },
    threshold: 10
  });

  var youtube = $('<iframe frameborder="0" allowfullscreen="1" src="https://www.youtube.com/embed/live_stream?channel=UCGnicvLKJ8M09dyELMXXg7g&autoplay=0&fs=1&enablejsapi=0&origin='+encodeURIComponent(location.origin)+'&widgetid=1" width="650" height="366" title="11th Radio Live"></iframe>');
  youtube.on('load', function () {
    var ratio;
    if (!youtube.attr('data-ratio')) {
      var width = parseInt(youtube.attr('width'));
      var height = parseInt(youtube.attr('height'));
      ratio = width / height;
      youtube.attr('data-ratio', ratio);
    }
    youtube.attr('width', '100%');
    youtube.attr('height', parseInt(youtube.width()) / youtube.attr('data-ratio'));
  });
  $('#youtube').html(youtube);




  if (document.documentElement.clientWidth >= 1024) {
    $('.track-info__img')
      .popover({
        html: true,
        trigger: 'hover',
        delay: 500,
        content: function () {
          return '<img class="track-info__popover-img" src="'+ this.src +'" />';
        }
      })
      .on('error', function () {
        this.src = '/img/social.png';
      });
  }

});






// var youtubeScript = document.createElement('script');
// youtubeScript.src = "https://www.youtube.com/iframe_api";
//
// document.head.appendChild(youtubeScript);

// var youtube;
// function onYouTubeIframeAPIReady() {
//   youtube = new YT.Player('youtube', {
//     // origin: 'http://11thradio.com',
//     height: '366',
//     width: '650',
//     videoId: 'obYGOLVjdgw',
//     events: {
//       'onReady': onPlayerReady,
//       'onStateChange': onPlayerStateChange
//     },
//     playerVars: {
//       autoplay: 1,
//       fs: 1
//     }
//   });
// }
//
// function onPlayerReady(event) {
//   console.log(event);
//   var iframe = event.target.getIframe();
//   iframe.src = 'https://www.youtube.com/embed/live_stream?channel=UCg-skjFYlC6MDFi7TW-2_Ow';
//   event.target.playVideo();
//
//   $(function () {
//     var iframe = $('.iframe-resize').find('iframe');
//     var ratio;
//     if (!iframe.attr('data-ratio')) {
//       var width = parseInt(iframe.attr('width'));
//       var height = parseInt(iframe.attr('height'));
//       ratio = width / height;
//       iframe.attr('data-ratio', ratio);
//     }
//     iframe.attr('width', '100%');
//     iframe.attr('height', parseInt(iframe.width()) / iframe.attr('data-ratio'));
//   });
// }
// var done = false;
// function onPlayerStateChange(event) {
//   console.log(event);
//   if (event.data == YT.PlayerState.PLAYING && !done) {
//     $(function () {
//       var toggle = $('.controls__toggle');
//       var player = $('.player');
//       player.attr('src', '');
//       toggle.addClass('controls__toggle--stopped');
//       done = true;
//     });
//   }
//   // console.log(event);
//   // console.log(event.target.getPlayerState());
// }


// function stopVideo() {
//   youtube.stopVideo();
// }