userAccess = ->
  $(document).on "user:started",->
    console.log "user:started"
  $(document).on "user:room:connected",->
    room = base.currentClient.room
    realtime = base.currentClient.realtime
    room.join(->
      util.showLog "你的昵称为#{base.currentClient.client_id},已经可以发言了"
    )
    room.receive (data)->
      if  util.parseMsgLevel(data) == "member"
        util.showMsg(data)
      else
        util.getCheatCode().then(
          ->
            util.showSystemMsg(data)
        )
    realtime.on 'reuse',->
      util.showLog "正在重新连接有渔直播聊天系统"

    realtime.on 'error',->
      util.showLog '好像有什么不对劲 请打开console 查看相关日志 '

    realtime.on 'kicked',(res) ->
      console.log res

    realtime.on 'join',(res)->
      _.each(res.m, (m)->
        name = m.split(":")[1]
        unless name == base.currentClient.client_id
          util.showLog(name + '加入有渔直播间')
      )

  $(document).on "user:pressEnter", ->
    msg = util.elements.inputSend.val()
    room = base.currentClient.room
    if base.notalk
      alert "目前是禁止发言状态"
      return
    else
      unless util.isEmptyString(msg)
        room.send({
          text:msg
          attr: {
            msgLevel: "member"
          }
        },
        {
          type: 'text'
        },
        (data) ->
          util.clearInput()
          util.showLog("#{util.formatTime(data.t)} 我：",msg)
        )
      else
        alert "请输入点文字"
        return

  $(document).on "user:inputSend:click", ->

  $(document).on "visitor:realtime:closed", ->
    console.log "vistor realtime closed"
    $(document).trigger("started")