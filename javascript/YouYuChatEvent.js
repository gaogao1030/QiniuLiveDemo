var base;

base = YouYuChatBase;

$(document).on("started", function() {
  var elements;
  elements = {
    body: $("body"),
    printWall: $("#printWall"),
    sendMsgBtn: $("#btnSend"),
    inputSend: $("#chatInput"),
    inputNickName: $("#inputNickName"),
    confirmName: $("#confirmName"),
    changeName: $("#changeName")
  };
  base.getConversation();
  return console.log("started");
});

$(document).on("conversation_id:Got", function() {
  console.log("got");
  return base.connectRoom();
});

$(document).on("room:connected", function() {
  base.closeRealTime(base.currentClient.realtime);
  return console.log("room connected");
});

$(document).on("room:created", function() {
  return console.log("room created");
});

$(document).on("realtime:closed", function() {
  return console.log("realtime closed");
});
