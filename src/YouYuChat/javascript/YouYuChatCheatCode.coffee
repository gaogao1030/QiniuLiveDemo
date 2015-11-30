YouYuChatBase = require './YouYuChatBase'
YouYuChatUtil = require './YouYuChatUtil'
Config = require './YouYuChatConfig'
md5 = require 'md5'
util = new YouYuChatUtil
base = new YouYuChatBase
YouYuChatConsole = require './YouYuChatConsole'
youyu_chat_console = new YouYuChatConsole

module.exports = ->
  YouYuChatCheatCode = {
    getCheatCode: ()->
      cheatCode = AV.Object.extend("CheatCode")
      q = new AV.Query(cheatCode)
      q.equalTo("objectId",Config.cheat_code_id)
      q.find({
        success: (res) =>
          base.baseState.set('notalk',res[0].attributes.notalk)
          base.baseState.set('auth_code',res[0].attributes.auth_code)
          base.baseState.set('cheat_code_token',res[0].attributes.token)
          base.baseState.set('white_list',res[0].attributes.white_list)
          base.baseState.set('white_list_open',res[0].attributes.white_list_open)
          base.baseState.set('broad_cast',res[0].attributes.broad_cast)
          base.baseState.set('notice',res[0].attributes.notice)
          base.baseState.set('live_stream',res[0].attributes.live_stream)
      })


    setCheatCode: (commnad,attr,permit)->
      permit ||= ""
      if md5(permit) == base.baseState.get("cheat_code_token")
        code = AV.Object.createWithoutData('CheatCode',Config.cheat_code_id)
        switch commnad
          when "shutup"
            base.baseState.set('notalk',false)
            code.set('notalk',attr)
            if attr
              text = "管理员开启了全员禁言"
            else
              text = "管理员关闭了全员禁言"
            code.save({
              success: ->
                base.baseState.get('room').send({
                  text: text
                  attr: {
                    msgLevel: "system"
                  }
                },
                {
                  type: 'text'
                },
                (data) ->
                  util.clearInput()
                  data.msg = text
                  util.showSystemMsg(data)
                )
            })
          when "changeAuthCode"
            code.set('auth_code',md5(attr))
            text = "授权码被改变页面将会被重新载入"
            code.save({
              success: ->
                base.baseState.get('room').send({
                  text: text
                  attr: {
                    msgLevel: "system"
                    reload: true
                  }
                },
                {
                  type: 'text'
                },
                (data) ->
                  util.refreshPage({msg:{attr:{reload:true}}})
                  util.clearInput()
                  data.msg = text
                  util.showSystemMsg(data)
                )
            })
          when "changeToken"
            code.set('token',md5(attr))
            text = "Token被改变页面即将重新载入"
            code.save({
              success: ->
                base.baseState.get('room').send({
                  text: text
                  attr: {
                    msgLevel: "system"
                    reload: true
                  }
                },
                {
                  type: 'text'
                },
                (data) ->
                  util.refreshPage({msg:{attr:{reload:true}}})
                  util.clearInput()
                  data.msg = text
                  util.showSystemMsg(data)
                )
            })
          when "changeNoTalk"
            base.baseState.set("notalk",attr)
          when 'whiteListGet'
            if attr.save_as_file
              return youyu_chat_console.save(base.baseState.get("white_list"),"whiteList.json")
            else
              return base.baseState.get("white_list")
          when 'whiteListSet'
            code.set("white_list",attr)
            text = "白名单被重置"
            code.save({
              success: ->
                base.baseState.get('room').send({
                  text: text
                  attr: {
                    msgLevel: "system"
                    reload: true
                  }
                },
                {
                  type: 'text'
                },
                (data) ->
                  util.refreshPage({msg:{attr:{reload:true}}})
                )
            })
          when 'whiteListAdd'
            white_list = base.baseState.get('white_list')
            white_list = _.extend(white_list,attr)
            code.set("white_list",white_list)
            code.save({
              success: ->
                console.log white_list
                base.baseState.set("white_list",white_list)
            })
          when 'whiteListRemove'
            @getCheatCode().then ->
              white_list = base.baseState.get('white_list')
              key = util.getKeyByValue(white_list,attr)
              delete white_list[key]
              code.set("white_list",white_list)
              code.save({
                success: ->
                  text = "白名单里删除了#{attr}"
                  base.baseState.set("white_list",white_list)
                  room_name = base.baseState.get('room_name')
                  base.baseState.get('room').remove("#{room_name}:#{key}")
                  base.baseState.get('room').send({
                    text: text
                    attr: {
                      msgLevel: "system"
                      userReload: key
                    }
                  },
                  {
                    type: 'text'
                  },
                  (data) ->
                    #util.refreshPage({msg:{attr:{reload:true}}})
                  )
              })
          when 'whiteListOpen'
            code.set("white_list_open",attr)
            if attr
              text = "开启白名单功能"
            else
              text = "关闭白名单功能"
            code.save({
              success: ->
                base.baseState.get('room').send({
                  text: text
                  attr: {
                    msgLevel: "system"
                    reload: true
                  }
                },
                {
                  type: 'text'
                },
                (data) ->
                  util.refreshPage({msg:{attr:{reload:true}}})
                )
            })
          when 'broadCastSet'
            code.set("broad_cast",attr)
            base.baseState.set("broad_cast",attr)
            code.save({
              success: ->
                console.log "广播更改完成"
            })
          when 'broadCastPush'
            text = base.baseState.get("broad_cast")
            util.showBroadCast({msg:{text: text}})
            base.baseState.get('room').send({
              text: text
              attr: {
                msgLevel: "broad_cast"
              }
            },
            {
              type: 'text'
              transient: true
            },
            (data) ->
            )
          when 'noticeSet'
            code.set("notice",attr)
            base.baseState.set("notice",attr)
            code.save({
              success: ->
                console.log "通知更改完成"
            })
          when 'getOnlineUser'
            util.fetchOnlineUser().then((online_members)->
              console.log online_members
            )
          when 'getOnlineUserCount'
            util.fetchOnlineUser().then((online_members)->
              online_members = _.without online_members,"qiniuLive:游客"
              console.log online_members.length
            )
          when 'setLiveStream'
            code.set("live_stream",attr)
            base.baseState.set("live_stream",attr)
            code.save({
              success: ->
                console.log "直播流已设置"
            })
          else
            console.log "no command"
      else
        console.log "permit denied"
}
