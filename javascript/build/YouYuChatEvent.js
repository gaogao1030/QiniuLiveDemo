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
  getConversation();
  return console.log("started");
});

$(document).on("conversation_id:Got", function() {
  connectRoom();
  return currentClient.realtime.on("error", function() {
    return console.log("error");
  });
});

$(document).on("room:connected", function() {
  closeRealTime(currentClient.realtime);
  return console.log("room connected");
});

$(document).on("room:created", function() {
  return console.log("room created");
});

$(document).on("realtime:closed", function() {
  return console.log("realtime closed");
});
