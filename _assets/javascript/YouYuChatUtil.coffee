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
      msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>'
    p = document.createElement('p')
    p.innerHTML = msg
    if (isBefore)
      $(p).insertBefore(printWall.children()[0])
    else
      printWall.append(p)

  encodeHTML:(source) ->
    return String(source)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')

  isEmptyString: (string)->
    if String(string).replace(/^\s+/, '').replace(/\s+$/, '')
      return false
    return true
}
