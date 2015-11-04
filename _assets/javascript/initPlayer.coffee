$ ->
  videojs("really-cool-video",{width:1280,height:720},->
    window.a = this
    do @play
    tmp_width  = do @width
    @on 'loadeddata', ->
      console.log "aa"
      setTimeout =>
        @width(tmp_width - 1)
      , 500
      setTimeout =>
        @width(tmp_width)
      , 1000
  )
