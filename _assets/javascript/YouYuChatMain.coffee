$(document).on "started",->
  YouYuChatUtil.elements = {
    body: $("body")
    printWall: $("#printWall")
    sendMsgBtn: $("#btnSend")
    inputSend: $("#chatInput")
    inputNickName: $("#inputNickName")
    confirmName: $("#confirmName")
    changeName: $("#changeName")
  }
  base.getConversation()
  registerEvent()
  console.log "started"
  $(document).trigger("visitor:started") if util.isVisitor()

$(document).on "conversation_id:Got",->
  console.log "conversation_id got"

$(document).on "room:connected",->
  #base.closeRealTime(base.currentClient.realtime)
  console.log "room connected"
  $(document).trigger("visitor:room:connected") if util.isVisitor()

$(document).on "room:created",->
  console.log "room created"

$(document).on "realtime:closed",->
  console.log "realtime closed"

$(document).on "log:got",->
  console.log "log got"

$(document).on "pressEnter", ->
  console.log "press enter"
  $(document).trigger("visitor:pressEnter") if util.isVisitor()

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

registerEvent = ->
  util.elements.body.on 'keydown', (e)->
    if e.keyCode == 13
      $(document).trigger("pressEnter")

  util.elements.sendMsgBtn.on 'click', (e)->
    $(document).trigger("sendMsgBtn:click")

  util.elements.inputSend.on 'click', (e)->
    $(document).trigger("inputSend:click")

  util.elements.confirmName.on 'click', (e)->
    $(document).trigger("confirmName:click")
