var appid, closeRealTime, connectRoom, createRealtime, createRoom, currentClient, getConversation, secret;

appid = "2PKFqnCxPQ8DWMK2uiRWsQpz";

secret = "Db8UOjtkzPgG1RrRHJSOPfth";

currentClient = {
  room_name: "qiniuLiveDemo",
  client_id: "游客"
};

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

createRealtime = function() {
  var result;
  result = AV.realtime({
    appId: appid,
    clientId: currentClient.roomname + currentClient.client_id,
    secure: false
  });
  currentClient.realtime = result;
  return result;
};

getConversation = function() {
  var conv, promise, q;
  promise = new AV.Promise;
  AV.initialize(appid, secret);
  conv = AV.Object.extend('_conversation');
  q = new AV.Query(conv);
  q.equalTo('attr.room_id', currentClient.room_name);
  q.find({
    success: function(response) {
      var conv_id, ref;
      conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
      currentClient.conv_id = conv_id;
      $(document).trigger("conversation_id:Got");
      return promise.resolve(conv_id);
    },
    error: function(err) {
      return promise.reject(err);
    }
  });
  return promise;
};

connectRoom = function() {
  var promise, realtime;
  promise = new AV.Promise;
  createRealtime();
  realtime = currentClient.realtime;
  return realtime.on('open', function() {
    return realtime.room(currentClient.conv_id, function(room) {
      $(document).trigger("room:connected");
      currentClient.room = room;
      return promise.resolve(room);
    });
  });
};

createRoom = function(room_name, client_id) {
  var promise, realtime;
  promise = new AV.Promise;
  createRealtime();
  realtime = currentClient.realtime;
  currentClient.room_name = room_name;
  currentClient.client_id = client_id;
  return realtime.on('open', function() {
    return realtime.room({
      name: currentClient.room_name,
      attr: {
        room_id: currentClient.room_name
      },
      members: [currentClient.room_name + ":" + currentClient.member_name]
    }, function(room) {
      currentClient.room = room;
      $(document).trigger("room:created");
      return promise.resolve(room);
    });
  });
};

closeRealTime = function(realtime) {
  var promise;
  promise = new AV.Promise;
  realtime.close();
  realtime.on('close', function() {
    promise.resolve();
    return $(document).trigger("realtime:closed");
  });
  return promise;
};
