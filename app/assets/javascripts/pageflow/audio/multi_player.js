pageflow.Audio.MultiPlayer = function(pool, options) {
  var current = new pageflow.AudioPlayer.Null();
  var currentId = null;
  var that = this;

  this.resume = function() {
    return current.play();
  };

  this.pause = function() {
    return current.pause();
  };

  this.position = function() {
    return current.position;
  };

  this.duration = function() {
    return current.duration;
  };

  this.fadeTo = function(id) {
    return changeCurrent(id, function(player) {
      player.playAndFadeIn(options.fadeDuration);
    });
  };

  this.play = function(id) {
    return changeCurrent(id, function(player) {
      player.play();
    });
  };

  this.formatTime = function(time) {
    return current.formatTime(time);
  };

  function changeCurrent(id, callback) {
    if (!options.playFromBeginning && id === currentId) {
      return;
    }

    var player = pool.get(id);
    currentId = id;

    if (options.playFromBeginning) {
      player.seek(0);
    }

    current.fadeOutAndPause(options.fadeDuration).then(function() {
      startEventPropagation(player, id);
      callback(player);
    });

    stopEventPropagation(current);
    current = player;
  }

  function startEventPropagation(player, id) {
    that.listenTo(player, 'play', function() {
      that.trigger('play', {audioFileId: id});
    });

    that.listenTo(player, 'pause', function() {
      that.trigger('pause', {audioFileId: id});
    });

    that.listenTo(player, 'timeupdate', function() {
      that.trigger('timeupdate', {audioFileId: id});
    });

    that.listenTo(player, 'ended', function() {
      that.trigger('ended', {audioFileId: id});
    });
  }

  function stopEventPropagation(player) {
    that.stopListening(player);
  }
};

_.extend(pageflow.Audio.MultiPlayer.prototype, Backbone.Events);