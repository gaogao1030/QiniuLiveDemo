$(document).on "started",->
  YouYuChatUtil.elements = {
    body: $("body")
    printWall: $("#printWall")
    sendMsgBtn: $("#btnSend")
    inputSend: $("#chatInput")
    inputNickName: $("#inputNickName")
    confirmName: $("#confirmName")
    changeName: $("#changeName")
    chatArea: $(".chat-area")
    modalDialog: $(".modal-dialog")
  }
  base.getConversation()
  console.log "started"
  if util.isVisitor()
    registerEvent()
    $(document).trigger("visitor:started")
  else
    $(document).trigger("user:started")
  util.getCheatCode().then(->
    auth_code = window.location.hash
    if md5(auth_code.slice("1")) != base.baseState.get("auth_code")
      window.location.href="/forbidden"
      return
  )

$(document).on "conversation_id:Got",->
  console.log "conversation_id got"
  base.connectRoom()
  base.currentClient.realtime.on "error",->
    console.log "error"

$(document).on "room:connected",->
  #base.closeRealTime(base.currentClient.realtime)
  console.log "room connected"
  if util.isVisitor()
    $(document).trigger("visitor:room:connected")
  else
    $(document).trigger("user:room:connected")

$(document).on "room:created",->
  console.log "room created"

$(document).on "realtime:closed",->
  console.log "realtime closed"
  unless util.isVisitor()
    $(document).trigger("visitor:realtime:closed")
  else
    $(document).trigger("user:realtime:closed")

$(document).on "log:got",->
  util.showChatLog()
  console.log "log got"

$(document).on "pressEnter", ->
  console.log "press enter"
  if util.isVisitor()
    $(document).trigger("visitor:pressEnter")
  else
    $(document).trigger("user:pressEnter")

$(document).on "sendMsgBtn:click", ->
  console.log "click sendMsgBtn"
  $(document).trigger("pressEnter")

$(document).on "inputSend:click", ->
  console.log "click inputSend"
  $(document).trigger("visitor:inputSend:click") if util.isVisitor()

$(document).on "confirmName:click", ->
  console.log "click conrfirmName"
  $(document).trigger("visitor:confirmName:click") if util.isVisitor()

visitorAccess()
userAccess()


registerEvent = ->
  util.elements.chatArea.on 'keydown', (e)->
    if e.keyCode == 13
      $(document).trigger("pressEnter")

  util.elements.modalDialog.on 'keydown', (e)->
    if e.keyCode == 13
      $(document).trigger("visitor:confirmName:click")

  util.elements.sendMsgBtn.on 'click', (e)->
    $(document).trigger("sendMsgBtn:click")

  util.elements.inputSend.on 'click', (e)->
    $(document).trigger("inputSend:click")

  util.elements.confirmName.on 'click', (e)->
    $(document).trigger("confirmName:click")
