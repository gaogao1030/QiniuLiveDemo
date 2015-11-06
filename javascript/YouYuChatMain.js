var registerEvent;

$(document).on("started", function() {
  YouYuChatUtil.elements = {
    body: $("body"),
    printWall: $("#printWall"),
    sendMsgBtn: $("#btnSend"),
    inputSend: $("#chatInput"),
    inputNickName: $("#inputNickName"),
    confirmName: $("#confirmName"),
    changeName: $("#changeName")
  };
  base.getConversation();
  registerEvent();
  console.log("started");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:started");
  }
});

$(document).on("conversation_id:Got", function() {
  return console.log("conversation_id got");
});

$(document).on("room:connected", function() {
  console.log("room connected");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:room:connected");
  }
});

$(document).on("room:created", function() {
  return console.log("room created");
});

$(document).on("realtime:closed", function() {
  return console.log("realtime closed");
});

$(document).on("log:got", function() {
  return console.log("log got");
});

$(document).on("pressEnter", function() {
  console.log("press enter");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:pressEnter");
  }
});

$(document).on("sendMsgBtn:click", function() {
  console.log("click sendMsgBtn");
  return $(document).trigger("pressEnter");
});

$(document).on("inputSend:click", function() {
  console.log("click inputSend");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:inputSend:click");
  }
});

$(document).on("confirmName:click", function() {
  console.log("click conrfirmName");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:confirmName:click");
  }
});

visitorAccess();

registerEvent = function() {
  util.elements.body.on('keydown', function(e) {
    if (e.keyCode === 13) {
      return $(document).trigger("pressEnter");
    }
  });
  util.elements.sendMsgBtn.on('click', function(e) {
    return $(document).trigger("sendMsgBtn:click");
  });
  util.elements.inputSend.on('click', function(e) {
    return $(document).trigger("inputSend:click");
  });
  return util.elements.confirmName.on('click', function(e) {
    return $(document).trigger("confirmName:click");
  });
};
