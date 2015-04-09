pageflow.mediaPlayer.volumeBinding = function(player, settings) {
  var originalPlay = player.play;
  var originalPause = player.pause;

  player.play = function() {
    player.volume(settings.get('volume'));
    listenToVolumeSetting();

    return originalPlay.call(player);
  };

  player.playAndFadeIn = function(duration) {
    if (player.playing) {
      return new jQuery.Deferred().resolve().promise();
    }

    player.volume(0);

    return $.when(originalPlay.call(player)).then(function() {
      listenToVolumeSetting();
      return player.fadeVolume(settings.get('volume'), duration);
    });
  };

  player.pause = function() {
    stopListeningToVolumeSetting();
    originalPause.call(player);
  };

  player.fadeOutAndPause = function(duration) {
    if (!player.playing) {
      return new jQuery.Deferred().resolve().promise();
    }

    stopListeningToVolumeSetting();

    return player.fadeVolume(0, duration).then(function() {
      originalPause.call(player);
    });
  };

  function listenToVolumeSetting() {
    settings.on('change:volume', onVolumeChange);
  }

  function stopListeningToVolumeSetting() {
    settings.off('change:volume', onVolumeChange);
  }

  function onVolumeChange(model, value) {
    player.fadeVolume(value, 40);
  }
};