userAccess = ->
  $(document).on "user:started",->
    util.elements.sendMsgBtn.attr("disabled",false)
    console.log "user:started"
  $(document).on "user:room:connected",->
    room = base.baseState.get('room')
    realtime = base.baseState.get('realtime')
    room.join(->
      util.showInfo "你的昵称为<span class='green'>#{base.baseState.get('client_id')}</span>,已经可以发言了"
    )
    room.receive (data)->
      util.refreshPage(data)
      if  util.parseMsgLevel(data) == "member"
        util.showMsg(data)
      else
        util.getCheatCode().then(
          ->
            util.showSystemMsg(data)
        )

    realtime.on 'reuse',->
      util.showInfo "正在重新连接有渔直播聊天系统"

    realtime.on 'error',->
      util.showInfo '好像有什么不对劲 请打开console 查看相关日志 '

    realtime.on 'kicked',(res) ->
      console.log res

    realtime.on 'join',(res)->
      _.each(res.m, (m)->
        name = m.split(":")[1]
        unless name == base.baseState.get('client_id')
          util.showInfo(name + '加入有渔直播间')
      )

  $(document).on "user:pressEnter", ->
    msg = util.elements.inputSend.val()
    room = base.baseState.get('room')
    if base.baseState.get('notalk')
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
          util.showMyMsg(data,msg)
        )
      else
        alert "请输入点文字"
        return

  $(document).on "user:inputSend:click", ->

  $(document).on "visitor:realtime:closed", ->
    console.log "vistor realtime closed"
    $(document).trigger("started")
