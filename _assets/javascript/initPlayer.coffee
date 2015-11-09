$ ->
  #videojs("really-cool-video",{width:1280,height:720},->
  #  window.a = this
  #  do @play
  #  tmp_width  = do @width
  #  @on 'loadeddata', ->
  #    setTimeout =>
  #      @width(tmp_width - 1)
  #    , 500
  #    setTimeout =>
  #      @width(tmp_width)
  #    , 1000
  #)

  j = jwplayer "jwVideo"
  j.setup({
    #file: 'http://foodsound.qiniudn.com/video/introducing_thinglist.mp4'
    file: "test.flv"
    streamer: 'rtmp://pili-live-rtmp.live.youyu.im/cimu'
    id: "cimu"
    type: 'rtmp/mp4'
    width: '60%'
    aspectratio: "10:6"
    provider: 'rtmp'
    autostart: false
    height: 300
  })
