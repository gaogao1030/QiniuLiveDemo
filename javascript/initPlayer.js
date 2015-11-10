$(function() {
  var container, player, playerContainer;
  playerContainer = $("<video />", {
    "class": "video-js vjs-default-skin"
  }).attr({
    controls: true
  }).css({
    width: "100%",
    height: "100%"
  });
  playerContainer.append($("<source />", {
    src: "rtmp://pili-live-rtmp.live.youyu.im/cimu/test",
    type: "rtmp/mp4"
  }));
  container = $("#player");
  container.append(playerContainer);
  player = videojs(playerContainer.get(0), {
    width: 500,
    height: 500
  }, function() {
    var $live_area, width;
    this.play();
    $live_area = $(".live-area");
    width = $live_area.width();
    return this.on('loadeddata', function() {
      $live_area.css({
        width: "79%"
      });
      return setTimeout((function(_this) {
        return function() {
          return $live_area.css({
            width: "80%"
          });
        };
      })(this), 100);
    });
  });
  return player;
});
