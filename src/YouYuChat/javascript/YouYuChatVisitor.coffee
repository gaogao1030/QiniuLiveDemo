YouYuChatUtil = require './YouYuChatUtil'
YouYuChatBase = require './YouYuChatBase'
YouYuChatCheatCode = require './YouYuChatCheatCode'
util = new YouYuChatUtil
base = new YouYuChatBase
cheat_code = new YouYuChatCheatCode

module.exports = ->
  $(document).on "visitor:started",->
    util.showInfo "正在连接有渔直播室..."

  $(document).on "visitor:room:connected",->
    util.showInfo "欢迎来到有渔直播课堂，您可通过下方聊天框与直播老师互动。"
    util.showBroadCast {msg:{text:base.baseState.get('broad_cast')}}
    room = base.baseState.get('room')
    realtime = base.baseState.get('realtime')
    room.join(->
      base.getLog(room)
    )
    room.receive (data)->
      util.refreshPage(data)
      if  util.parseMsgLevel(data) == "member"
        util.showMsg(data)
      else if util.parseMsgLevel(data) == "broad_cast"
        util.showBroadCast(data)
      else
        util.showSystemMsg(data)
    realtime.on 'reuse',->
      util.showInfo "正在重新连接有渔直播聊天系统"

    realtime.on 'error',->
      util.showInfo '好像有什么不对劲 请打开console 查看相关日志 '

    realtime.on 'join',(res)->
      _.each(res.m, (m)->
        name = m.split(":")[1]
        unless name == base.baseState.get('client_id')
          name = util.parseClientIdToName(name)
          util.showInfo(name + '加入有渔直播间')
          util.fetchOnlineUser().then((online_members)->
            online_members = _.without online_members,"qiniuLive:游客"
            util.showSystemMsg({msg:"当前登录用户有#{online_members.length}人"})
          )
      )

    realtime.on 'kicked',(res) ->
      console.log res
      util.showSystemMsg({msg:"你已经被踢出该房间"})

    realtime.on 'membersleft',(res) ->
      _.each(res.m,(m)->
        clientId = m.split(":")[1]
        console.log "#{util.parseClientIdToName(clientId)}离开了房间"
      )

  $(document).on "visitor:pressEnter", ->
    alert "你目前还未输入姓名，不可以发言"

  $(document).on "visitor:inputSend:click", ->
    util.elements().changeName.modal("show")

  $(document).on "visitor:confirmName:click", ->
    client_id = util.elements().inputNickName.val()
    cheat_code.getCheatCode().then ->
      if util.inWhiteList(client_id) || !base.baseState.get("white_list_open")
        base.baseState.set('client_id',client_id)
        unless util.isEmptyString(client_id)
          base.closeRealTime base.baseState.get('realtime')
          util.elements().changeName.modal("hide")
        else
          alert "昵称不能为空"
      else
        alert "你输入的昵称不在白名单中"
