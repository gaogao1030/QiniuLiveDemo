YouYuChatUtil = require './YouYuChatUtil'
YouYuChatBase = require './YouYuChatBase'
util = new YouYuChatUtil
base = new YouYuChatBase

module.exports = ->
  $(document).on "user:started",->
    util.elements().sendMsgBtn.attr("disabled",false)
    console.log "user:started"
  $(document).on "user:room:connected",->
    room = base.baseState.get('room')
    realtime = base.baseState.get('realtime')
    room.join(->
      util.showInfo "你的昵称为<span class='green'>#{util.parseClientIdToName(base.baseState.get('client_id'))}</span>,已经可以发言了"
      util.fetchOnlineUser().then((online_members)->
        online_members = _.without online_members,"qiniuLive:游客"
        util.showSystemMsg({msg:"当前登录用户有#{online_members.length}人"})
      )
    )
    room.receive (data)->
      util.refreshPage(data)
      if  util.parseMsgLevel(data) == "member"
        util.showMsg(data)
      else if util.parseMsgLevel(data) == "broad_cast"
        util.showBroadCast(data)
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
      util.showSystemMsg({msg:"你已经被踢出该房间"})

    realtime.on 'membersleft',(res) ->
      _.each(res.m,(m)->
        clientId = m.split(":")[1]
        console.log "#{util.parseClientIdToName(clientId)}离开了房间"
      )

    realtime.on 'join',(res)->
      _.each(res.m, (m)->
        name = m.split(":")[1]
        unless name == base.baseState.get('client_id') or name == "游客"
          name = util.parseClientIdToName(name)
          util.showInfo(name + '加入有渔直播间')
          util.fetchOnlineUser().then((online_members)->
            online_members = _.without online_members,"qiniuLive:游客"
            util.showSystemMsg({msg:"当前登录用户有#{online_members.length}人"})
          )
      )

  $(document).on "user:pressEnter", ->
    msg = util.elements().inputSend.val()
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
