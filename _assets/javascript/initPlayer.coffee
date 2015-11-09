$ ->
  playerContainer = $("<video />", {
      "class": "video-js vjs-default-skin"
    })
    .attr {
      controls: true
      }
    .css {
      width: "100%"
      height: "100%"
      }

  playerContainer.append $("<source />", {
      src: "rtmp://pili-live-rtmp.live.youyu.im/cimu/test"
      type: "rtmp/mp4"
    })


  container = $("#player")

  container.append playerContainer
  player = videojs playerContainer.get(0)

  return player

#videojs("really-cool-video",{width:1280,height:720},->
#    window.a = this
#    do @play
#    tmp_width  = do @width
#    @on 'loadeddata', ->
#      setTimeout =>
#        @width(tmp_width - 1)
#      , 500
#      setTimeout =>
#        @width(tmp_width)
#      , 1000
#  )

