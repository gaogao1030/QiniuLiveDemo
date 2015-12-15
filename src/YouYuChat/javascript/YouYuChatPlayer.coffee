YouYuChatBase = require './YouYuChatBase'
MobileDetect = require 'mobile-detect'
md = new MobileDetect(window.navigator.userAgent)


base = new YouYuChatBase
module.exports = ->
  YouYuChatPlayer = {
    state:
      inited: false
    init: ->
      unless @state.inited
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
            src: base.baseState.get('live_stream').rtmp
            type: "rtmp/mp4"
          })
        playerContainer.append $("<source />", {
            src: base.baseState.get('live_stream').hls
            type: "application/x-mpegURL"
          })
        container = $("#player")
        container.append playerContainer
        player = videojs playerContainer.get(0),{width:500,height:500},
          ->
            do @play
            if md.os() == "iOS"
              $(".cover").remove()
            $live_area = $(".live-area")
            width = $live_area.width()
            @on 'loadeddata', ->
              $(".cover").remove()
              $live_area.css(width: "79%")
              setTimeout =>
                $live_area.css(width: "80%")
              , 100
        @state.inited = true
        return player
  }
