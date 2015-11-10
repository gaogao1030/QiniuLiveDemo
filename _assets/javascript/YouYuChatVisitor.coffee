visitorAccess = ->
  $(document).on "visitor:started",->
    util.showLog "正在连接有渔直播室..."

  $(document).on "visitor:room:connected",->
    util.showLog "欢迎来到有渔直播室，请点击消息框输入您的姓名后再发言"
    room = base.currentClient.room
    realtime = base.currentClient.realtime
    room.join(->
      base.getLog(room)
    )
    room.receive (data)->
      if  util.parseMsgLevel(data) == "member"
        util.showMsg(data)
      else
        util.showSystemMsg(data)
    realtime.on 'reuse',->
      util.showLog "正在重新连接有渔直播聊天系统"

    realtime.on 'error',->
      util.showLog '好像有什么不对劲 请打开console 查看相关日志 '

    realtime.on 'join',(res)->
      _.each(res.m, (m)->
        name = m.split(":")[1]
        unless name == base.currentClient.client_id
          util.showLog(name + '加入有渔直播间')
      )

    realtime.on 'kicked',(res) ->
      console.log res

  $(document).on "visitor:pressEnter", ->
    alert "你目前还未输入姓名，不可以发言"

  $(document).on "visitor:inputSend:click", ->
      util.elements.changeName.modal("show")

  $(document).on "visitor:confirmName:click", ->
    client_id = util.elements.inputNickName.val()
    base.currentClient.client_id = client_id
    unless util.isEmptyString(client_id)
      base.closeRealTime base.currentClient.realtime
      util.elements.changeName.modal("hide")
