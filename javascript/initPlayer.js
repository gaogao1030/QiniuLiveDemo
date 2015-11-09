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
    width: 100,
    height: 100
  }, function() {
    var tmp_width;
    this.play();
    tmp_width = this.width();
    return this.on('loadeddata', function() {
      setTimeout((function(_this) {
        return function() {
          return _this.width(tmp_width - 1);
        };
      })(this), 500);
      return setTimeout((function(_this) {
        return function() {
          return _this.width(tmp_width);
        };
      })(this), 1000);
    });
  });
  return player;
});
