base=YouYuChatBase
$(document).on "started",->
  elements = {
    body: $("body")
    printWall: $("#printWall")
    sendMsgBtn: $("#btnSend")
    inputSend: $("#chatInput")
    inputNickName: $("#inputNickName")
    confirmName: $("#confirmName")
    changeName: $("#changeName")
  }
  base.getConversation()
  console.log "started"

$(document).on "conversation_id:Got",->
  console.log "got"
  base.connectRoom()
  #currentClient.realtime.on "error",->
  #  console.log "error"

$(document).on "room:connected",->
  base.closeRealTime(base.currentClient.realtime)
  console.log "room connected"

$(document).on "room:created",->
  console.log "room created"

$(document).on "realtime:closed",->
  console.log "realtime closed"
