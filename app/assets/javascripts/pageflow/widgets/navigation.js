/*global IScroll*/

(function($) {
  $.widget('pageflow.navigation', {
    _create: function() {
      var element = this.element,
          overlays = element.find('.navigation_site_detail'),
          hasHomeButton = !!element.find('.navigation_home').length,
          toggleIndicators = function() {};

      element.addClass('js').append(overlays);

      $('a.navigation_top', element).topButton();

      $('.navigation_bar_bottom', element)
        .append($('.navigation_bar_top > li', element).slice(hasHomeButton ? 4 : 3));


      $('.navigation_volume_box', element).volumeSlider({orientation: 'h'});
      $('.navigation_mute', element).muteButton();

      /* hide volume button on mobile devices */

      if (pageflow.browser.has('mobile platform')) {
        $('li.mute', element).hide();
        $('.navigation_bar_bottom', element).css('height', '224px');
        $('.scroller', element).css('bottom', '224px');
        $('.scroll_indicator.bottom', element).css('bottom', '190px');
      }

      /* header button */
      $('.navigation_main', element).click(function() {
        $(this)
          .toggleClass('active')
          .updateTitle();
        $('.header').toggleClass('active');
      });

      /* open header through skiplinks */
      $('a[href="#header"], a[href="#search"]', '#skipLinks').click(function() {
        $('.navigation_main', element).addClass('active');
        $('.header').addClass('active');
        $(this.getAttribute('href')).select();
      });

      /* share-button */
      $('.navigation_menu .navigation_menu_box a', element).focus(function() {
        $(this).parent().parent().addClass('focused');
      }).blur(function() {
        $(this).parent().parent().removeClass('focused');
      });

      var shareBox = $('.navigation_share_box', element),
          links = $('> a', shareBox);
      shareBox.shareMenu({
        subMenu: $('.sub_share', element),
        links: links,
        insertAfter: links.last(),
        closeOnMouseLeaving: shareBox
      });

      /* pages */
      var pageLinks = $('.navigation_thumbnails a', element),
        target;

      function registerHandler() {
        target = $(this);
        target.one('mouseup touchend', goToPage);
      }

      function removeHandler() {
        pageLinks.off('mouseup touchend', goToPage);
      }

      function closeOverview() {
        $('.overview').removeClass("active");
        $('.navigation_index', element).removeClass("active");
      }

      function hideOverlay() {
        $(overlays).addClass('hidden').removeClass('visible');
      }

      function goToPage(e) {
        if (target && target[0] != e.currentTarget) {
          return;
        }
        hideOverlay();
        closeOverview();
        $('.page .content, .scroll_indicator').removeClass('hidden');
        pageflow.slides.goToById(this.getAttribute("data-link"));
        e.preventDefault();
      }

      pageLinks.each(function(index) {
        var handlerIn = function() {
          if (!('ontouchstart' in document.documentElement)) {
            $(overlays[index]).css("top", $(this).offset().top).addClass('visible').removeClass('hidden');
          }
        };

        $(this).on({
          'mouseenter': handlerIn,
          'mouseleave': hideOverlay,
          'mousedown touchstart': registerHandler,
          'click': goToPage
        });
      });

      $(window).on('resize', function () {
        $(overlays).css("top","0");
        initiateIndicators();
      });

      var initiateIndicators = function() {
        setTimeout(function() {
          $('.scroll_indicator', element).show();
          toggleIndicators();
        }, 500);
      };

      $('.scroller', element).each(function () {
        var bottomIndicator = $('.scroll_indicator.bottom', element),
          topIndicator = $('.scroll_indicator.top', element),
          scrollUpIntervalID, scrollDownIntervalID,
          hideOverlay = function () {
            overlays.addClass('hidden').removeClass('visible');
          };

        var atBoundary = function (direction) {
          if (direction === 'up') {
            return (scroller.y >= 0);
          }
          else {
            return (scroller.y <= scroller.maxScrollY);
          }
        };

        toggleIndicators = function () {
          if (atBoundary('down')) {
            clearInterval(scrollDownIntervalID);
            bottomIndicator.hide().removeClass('pressed');
          }
          if (atBoundary('up')) {
            clearInterval(scrollUpIntervalID);
            topIndicator.hide().removeClass('pressed');
          }
          if (!atBoundary('up') && !atBoundary('down')) {
            topIndicator.show();
            bottomIndicator.show();
          }
        };

        var keyPressHandler = function(e) {
          var that = this,
            scrollByStep = function() {
              if ($(that).hasClass('bottom')) {
                scroller.scrollBy(0, -20, 80);
              } else {
                scroller.scrollBy(0, 20, 80);
              }
              toggleIndicators();
            };

          if (e.which == 13) {
            scrollByStep();

            setTimeout(function() {
              that.focus();
            }, 50);
          }
          else if (e.which === 0) {
            scrollByStep();
          }
        };

        var scrollerOptions = {
          mouseWheel: true,
          bounce    : false,
          probeType : 2
        };

        /*
          This is just a quick fix to detect IE10. We should
          refactor this condition if we decide to use Modernizr
          or another more global detection.
         */
        if (window.navigator.msPointerEnabled) {
          scrollerOptions.preventDefault = false;
        }

        var scroller = new IScroll(this, scrollerOptions);

        $('ul.navigation_thumbnails', element).pageNavigationList({
          scroller: scroller,
          scrollToActive: true
        });

        pageflow.ready.then(function() {
          toggleIndicators();
        });

        topIndicator.on({
          'mousedown': function () {
            scrollUpIntervalID = setInterval(function () {
              scroller.scrollBy(0, 1);
              toggleIndicators();
            }, 5);
          },
          'keypress': keyPressHandler,
          'touchstart': keyPressHandler
        });

        topIndicator.on('mouseup touchend', function() {
          clearInterval(scrollUpIntervalID);
        });

        bottomIndicator.on({
          'mousedown': function() {
            scrollDownIntervalID = setInterval(function() {
              scroller.scrollBy(0, -1);
              toggleIndicators();
            }, 5);
          },
          'keypress': keyPressHandler,
          'touchstart': keyPressHandler
        });

        bottomIndicator.on('mouseup touchend', function () {
          clearInterval(scrollDownIntervalID);
        });

        toggleIndicators();

        scroller.on('scroll', function () {
          toggleIndicators();
          hideOverlay();
          removeHandler();
        });

      });

      /* hide text button */
      var hideText = $('.navigation_hide_text', element);

      hideText.click(function() {
        pageflow.hideText.toggle();
      });

      pageflow.hideText.on('activate deactivate', function() {
        hideText.toggleClass('active', pageflow.hideText.isActive()).updateTitle();
      });

      /* fullscreen button */
      $('.navigation_bar_bottom .fullscreen a', element).fullscreenButton();

      $('.button, .navigation_mute, .scroll_indicator', element).on({
        'touchstart mousedown': function() {
          $(this).addClass('pressed');
        },
        'touchend mouseup': function() {
          $(this).removeClass('pressed');
        }
      });

      $('.navigation_share, .navigation_credits', element).on({
        'touchstart': function() {
          var element = $(this).parent().parent();
          element.addClass('open');

          function close(e) {
            if (!element.find(e.target).length) {
              element.removeClass('open');
              $('body').off('touchstart', close);
            }
          }
          $('body').on('touchstart', close);
        }
      });

      $('li', element).on('mouseleave', function() {
        $(this).blur();
      });

      $('body').on({
        'pageactivate': function(e) {
          toggleIndicators();
        }
      });
    }
  });
}(jQuery));
