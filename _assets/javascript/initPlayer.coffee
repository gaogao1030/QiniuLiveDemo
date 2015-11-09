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
  #
  j = jwplayer "jwVideo"
  j.setup({
    file: 'http://foodsound.qiniudn.com/video/introducing_thinglist.mp4'
    #file: 'rtmp://pili-live-rtmp.live.youyu.im/cimu/test'
    id: 'jwVideo'
    width: '60%'
    aspectratio: "10:6"
    autostart: false
  })
