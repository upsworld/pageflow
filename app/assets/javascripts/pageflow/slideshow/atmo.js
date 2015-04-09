(function() {
  var attributeName = 'atmo_audio_file_id';

  pageflow.Atmo = pageflow.Object.extend({
    initialize: function(slideshow, events, multiPlayer) {
      this.slideshow = slideshow;
      this.multiPlayer = multiPlayer;

      this.listenTo(events, 'page:change page:update', function() {
        this.update();
      });
    },

    pause: function() {
      this.multiPlayer.pause();
    },

    resume: function() {
      this.multiPlayer.resume();
    },

    update: function() {
      var configuration = this.slideshow.currentPageConfiguration();

      this.multiPlayer.fadeTo(configuration[attributeName]);
    },

    createMediaPlayerHooks: function(configuration) {
      var atmo = this;

      if (configuration.pause_atmo) {
        return {
          before: function() {
            return atmo.pause();
          },

          after: function() {
            return atmo.resume();
          }
        };
      }
    }
  });

  pageflow.Atmo.create = function(slideshow, events, audio) {
    return new pageflow.Atmo(
      slideshow,
      events,
      audio.createMultiPlayer({
        loop: true,
        fadeDuration: 500,
        playFromBeginning: false
      })
    );
  };
}());