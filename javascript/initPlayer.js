$(function() {
  var j;
  j = jwplayer("jwVideo");
  return j.setup({
    file: "test.flv",
    streamer: 'rtmp://pili-live-rtmp.live.youyu.im/cimu',
    id: "cimu",
    type: 'rtmp/mp4',
    width: '60%',
    aspectratio: "10:6",
    provider: 'rtmp',
    autostart: false,
    height: 300
  });
});
