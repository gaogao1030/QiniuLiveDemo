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
  player = videojs(playerContainer.get(0));
  return player;
});
