var registerEvent;

$(document).on("started", function() {
  YouYuChatUtil.elements = {
    body: $("body"),
    printWall: $("#printWall"),
    sendMsgBtn: $("#btnSend"),
    inputSend: $("#chatInput"),
    inputNickName: $("#inputNickName"),
    confirmName: $("#confirmName"),
    changeName: $("#changeName"),
    chatArea: $(".chat-area"),
    modalDialog: $(".modal-dialog")
  };
  YouYuChatUtil.templates = {
    showlog: $("#showlog"),
    showmsg: $("#showmsg"),
    showsystemmsg: $("#showsystemmsg"),
    showmymsg: $("#showmymsg")
  };
  base.getConversation();
  console.log("started");
  if (util.isVisitor()) {
    registerEvent();
    $(document).trigger("visitor:started");
  } else {
    $(document).trigger("user:started");
  }
  return util.getCheatCode().then(function() {
    var auth_code;
    auth_code = window.location.hash;
    if (md5(auth_code.slice("1")) !== base.baseState.get("auth_code")) {
      window.location.href = "/forbidden";
    }
  });
});

$(document).on("conversation_id:Got", function() {
  console.log("conversation_id got");
  base.connectRoom();
  return base.currentClient.realtime.on("error", function() {
    return console.log("error");
  });
});

$(document).on("room:connected", function() {
  console.log("room connected");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:room:connected");
  } else {
    return $(document).trigger("user:room:connected");
  }
});

$(document).on("room:created", function() {
  return console.log("room created");
});

$(document).on("realtime:closed", function() {
  console.log("realtime closed");
  if (!util.isVisitor()) {
    return $(document).trigger("visitor:realtime:closed");
  } else {
    return $(document).trigger("user:realtime:closed");
  }
});

$(document).on("log:got", function() {
  util.showChatLog();
  return console.log("log got");
});

$(document).on("pressEnter", function() {
  console.log("press enter");
  if (util.isVisitor()) {
    return $(document).trigger("visitor:pressEnter");
  } else {
    return $(document).trigger("user:pressEnter");
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

userAccess();

registerEvent = function() {
  util.elements.chatArea.on('keydown', function(e) {
    if (e.keyCode === 13) {
      return $(document).trigger("pressEnter");
    }
  });
  util.elements.modalDialog.on('keydown', function(e) {
    if (e.keyCode === 13) {
      return $(document).trigger("visitor:confirmName:click");
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
