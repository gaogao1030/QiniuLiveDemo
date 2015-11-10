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
  isVisitor: ->
    if base.baseState.get('client_id') == "游客"
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

  showLog: (msg, data, isBefore) ->
    printWall = @elements.printWall
    printWall.scrollTop(printWall[0].scrollHeight)
    if (data)
      msg = msg + '<span class="strong">' + @encodeHTML(JSON.stringify(data)) + '</span>'
    p = document.createElement('p')
    p.innerHTML = msg
    if (isBefore)
      $(p).insertBefore(printWall.children()[0])
    else
      printWall.append(p)
    @scrollToBottomPrintWall()

  encodeHTML:(source) ->
    return String(source)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')

  isEmptyString: (string)->
    if String(string).replace(/^\s+/, '').replace(/\s+$/, '')
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
      @showLog( @formatTime(data.timestamp) + ' ' + @encodeHTML(from_name) + '： ', text, isBefore)

  showSystemMsg: (data,isBefore) ->
    if(data.msg.type)
      text = data.msg.text
    else
      text = data.msg
    @showLog("<span class='red'>系统提示:"+text+"</span>","",isBefore)

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
    })

  refreshPage: (data) ->
    if data.msg.attr.reload
      window.location.reload()

  parseMsgLevel: (data) ->
    return data.msg.attr.msgLevel

  setCheatCode: (commnad,attr,permit)->
    if md5(permit) == base.baseState.get("cheat_code_token")
      switch commnad
        when "shutup"
          base.baseState.set('notalk',false)
          code = AV.Object.createWithoutData('CheatCode',"563c9abb60b2c82f2b951424")
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
          code = AV.Object.createWithoutData('CheatCode',"563c9abb60b2c82f2b951424")
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
          code = AV.Object.createWithoutData('CheatCode',"563c9abb60b2c82f2b951424")
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

