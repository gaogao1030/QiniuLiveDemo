YouYuChatUtil = {
  #elements : {
  #  body: $("body")
  #  printWall: $("#printWall")
  #  sendMsgBtn: $("#btnSend")
  #  inputSend: $("#chatInput")
  #  inputNickName: $("#inputNickName")
  #  confirmName: $("#confirmName")
  #  changeName: $("#changeName")
  #  chatArea: $(".chat-area")
  #}
  #
  template: ($template,obj)->
    template = $template.html()
    _.template(template)(obj)

  isVisitor: ->
    blacklist = ["游客",""]
    if ( _.indexOf(blacklist,base.baseState.get('client_id')) != -1 )
      return true
    return false


  timeoutPromise: (promise,ms) ->
    delayPromise = ->
      return new AV.Promise(
        (resolve) ->
          setTimeout(resolve,ms)
      )
    timeout_promise = delayPromise(ms).then(
      ->
        Promise.reject(new Error("请求超时"))
    )
    return AV.Promise.race([promise,timeout_promise])

  formatTime: (time)->
    date = new Date(time)
    #return $.format.date(date,"yyyy-MM-dd hh:mm:ss")
    return $.format.date(date,"hh:mm:ss")

  renderToPrintWall: (template,isBefore) ->
    printWall = @elements.printWall
    printWall.scrollTop(printWall[0].scrollHeight)
    if (isBefore)
      $(template).insertBefore(printWall.children()[0])
    else
      printWall.append(template)
    @scrollToBottomPrintWall()

  showLog: (msg, isBefore) ->
    template = @template(@templates.showlog,{msg:@encodeHTML(msg)})
    @renderToPrintWall(template,isBefore)

  encodeHTML:(source) ->
    return String(source)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')

  isEmptyString: (string)->
    if String(string).replace(/^\s+/, '').replace(/\s+$/, '') != ""
      return false
    return true

  clearInput: ->
    @elements.inputSend.val('')

  scrollToBottomPrintWall: ->
    printWall = @elements.printWall
    printWall.scrollTop(printWall[0].scrollHeight)

  showMsg: (data, isBefore) ->
    text = ''
    from = data.fromPeerId
    from_name = data.fromPeerId.split(":")[1]
    if(data.msg.type)
      text = data.msg.text
    else
      text = data.msg
    unless @isEmptyString(text)
      template = @template(@templates.showmsg,{msg_time:@formatTime(data.timestamp),from_name: @encodeHTML(from_name),text: text})
      @renderToPrintWall(template,isBefore)

  showMyMsg: (data,text,isBefore) ->
    template = @template(@templates.showmymsg,{msg_time:@formatTime(data.t),from_name: base.baseState.get("client_id"),text: text})
    @renderToPrintWall(template,isBefore)


  showSystemMsg: (data,isBefore) ->
    if(data.msg.type)
      text = data.msg.text
    else
      text = data.msg
    template = @template(@templates.showsystemmsg,{text:text})
    @renderToPrintWall(template,isBefore)

  showChatLog: ->
    log = base.baseState.get('log')
    printWall = @elements.printWall
    _.each(log,(log) =>
      if @parseMsgLevel(log) == "member"
        @showMsg(log, true)
      else
        @showSystemMsg(log, true)
    )

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
    })

  refreshPage: (data) ->
    if data.msg.attr.reload
      window.location.reload()

  parseMsgLevel: (data) ->
    return data.msg.attr.msgLevel

  getKeyByValue: (obj,v) ->
    keys = _.map(obj,
      (value,key)->
        return key if value == v
    )
    return _.compact(keys)[0]

  inWhiteList: (code) ->
    return _.has(base.baseState.get("white_list"),code)

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
              console.log "白名单删除了#{attr}"
              base.baseState.set("white_list",white_list)
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

window.listget = (permit) ->
  if md5(permit) == base.baseState.get("cheat_code_token")
    return base.baseState.get("white_list")

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
