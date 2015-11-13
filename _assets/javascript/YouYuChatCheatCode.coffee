_.extend YouYuChatUtil,{
  getCheatCode: ()->
    cheatCode = AV.Object.extend("CheatCode")
    q = new AV.Query(cheatCode)
    q.equalTo("objectId","563c9abb60b2c82f2b951424")
    q.find({
      success: (res) =>
        base.baseState.set('notalk',res[0].attributes.notalk)
        base.baseState.set('auth_code',res[0].attributes.auth_code)
        base.baseState.set('cheat_code_token',res[0].attributes.token)
        base.baseState.set('white_list',res[0].attributes.white_list)
        base.baseState.set('white_list_open',res[0].attributes.white_list_open)
        base.baseState.set('broad_cast',res[0].attributes.broad_cast)
    })


  setCheatCode: (commnad,attr,permit)->
    permit ||= ""
    if md5(permit) == base.baseState.get("cheat_code_token")
      code = AV.Object.createWithoutData('CheatCode',"563c9abb60b2c82f2b951424")
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
          white_list = base.baseState.get('white_list')
          key = @getKeyByValue(white_list,attr)
          delete white_list[key]
          code.set("white_list",white_list)
          code.save({
            success: ->
              text = "白名单里删除了#{attr}"
              base.baseState.set("white_list",white_list)
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
              console.log "通知更改完成"
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
        when 'getOnlineMemberCount'
          room = base.baseState.get('room')
          room.count((data)->
            console.log data
          )
        else
          console.log "no command"
    else
      console.log "permit denied"
}

window.talklocal = (token)->
  util.setCheatCode("changeNoTalk",false,token)

window.talkon = (token)->
  util.setCheatCode("shutup",false,token)

window.talkoff = (token)->
  util.setCheatCode("shutup",true,token)

window.tokenchange = (oldtoken,newtoken)->
  util.setCheatCode("changeToken",newtoken,oldtoken)

window.authcode = (token,auth_code)->
  util.setCheatCode("changeAuthCode",auth_code,token)

window.listget = (token) ->
  util.setCheatCode("whiteListGet","",token)

window.listset = (token,white_list) ->
  util.setCheatCode("whiteListSet",white_list,token)

window.listpush = (token,white_list) ->
  util.setCheatCode("whiteListAdd",white_list,token)

window.listpop = (token,value) ->
  util.setCheatCode("whiteListRemove",value,token)

window.liston = (token) ->
  util.setCheatCode("whiteListOpen",true,token)

window.listoff = (token) ->
  util.setCheatCode("whiteListOpen",false,token)

window.castset = (token,msg) ->
  util.setCheatCode("broadCastSet",msg,token)

window.castpush = (token,msg) ->
  util.setCheatCode("broadCastPush","",token)

window.onlineCount = (token) ->
  util.setCheatCode("getOnlineMemberCount","",token)
