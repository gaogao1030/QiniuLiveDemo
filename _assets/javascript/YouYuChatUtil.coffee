YouYuChatUtil = {
  #elements : {
  #  body: $("body")
  #  printWall: $("#printWall")
  #  sendMsgBtn: $("#btnSend")
  #  inputSend: $("#chatInput")
  #  inputNickName: $("#inputNickName")
  #  confirmName: $("#confirmName")
  #  changeName: $("#changeName")
  #}
  isVisitor: ->
    if base.currentClient.client_id == "游客"
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
    log = base.log
    printWall = @elements.printWall
    _.each(log,(log) =>
      if @parseMsgLevel(log) == "member"
        @showMsg(log, true)
      else
        @showSystemMsg(log, true)
    )

  getCheatCode: ->
    cheatCode = AV.Object.extend("CheatCode")
    q = new AV.Query(cheatCode)
    q.equalTo("objectId","563c9abb60b2c82f2b951424")
    q.find({
      success: (res) =>
        base.notalk = res[0].attributes.notalk
    })

  parseMsgLevel: (data) ->
    return data.msg.attr.msgLevel

  setCheatCode: (attr,permit)->
    if md5(permit) == "c2fc2f64438b1eb36b7e244bdb7bd535"
      base.notalk = false
      code = AV.Object.createWithoutData('CheatCode',"563c9abb60b2c82f2b951424")
      code.set('notalk',attr)
      if attr
        text = "管理员开启了全员禁言"
      else
        text = "管理员关闭了全员禁言"
      code.save({
        success: ->
          base.currentClient.room.send({
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
    else
      console.log "permit denied"
}
