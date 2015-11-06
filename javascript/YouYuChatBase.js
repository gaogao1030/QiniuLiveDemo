var YouYuChatBase;

YouYuChatBase = {
  appid: "2PKFqnCxPQ8DWMK2uiRWsQpz",
  secret: "Db8UOjtkzPgG1RrRHJSOPfth",
  currentClient: {
    room_name: "qiniuLiveDemo",
    client_id: "游客"
  },
  createRealtime: function() {
    var result;
    result = AV.realtime({
      appId: this.appid,
      clientId: this.currentClient.roomname + this.currentClient.client_id,
      secure: false
    });
    this.currentClient.realtime = result;
    return result;
  },
  getConversation: function() {
    var conv, promise, q;
    promise = new AV.Promise;
    AV.initialize(this.appid, this.secret);
    conv = AV.Object.extend('_conversation');
    q = new AV.Query(conv);
    q.equalTo('attr.room_id', this.currentClient.room_name);
    q.find({
      success: (function(_this) {
        return function(response) {
          var conv_id, ref;
          conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
          _this.currentClient.conv_id = conv_id;
          $(document).trigger("conversation_id:Got");
          return promise.resolve(conv_id);
        };
      })(this),
      error: (function(_this) {
        return function(err) {
          return promise.reject(err);
        };
      })(this)
    });
    return promise;
  },
  connectRoom: function() {
    var promise, realtime;
    promise = new AV.Promise;
    this.createRealtime();
    realtime = this.currentClient.realtime;
    return realtime.on('open', (function(_this) {
      return function() {
        return realtime.room(_this.currentClient.conv_id, function(room) {
          $(document).trigger("room:connected");
          _this.currentClient.room = room;
          return promise.resolve(room);
        });
      };
    })(this));
  },
  createRoom: function(room_name, client_id) {
    var promise, realtime;
    promise = new AV.Promise;
    this.createRealtime();
    realtime = this.currentClient.realtime;
    this.currentClient.room_name = room_name;
    this.currentClient.client_id = client_id;
    return realtime.on('open', function() {
      return realtime.room({
        name: this.currentClient.room_name,
        attr: {
          room_id: this.currentClient.room_name
        },
        members: [this.currentClient.room_name + ":" + this.currentClient.member_name]
      }, function(room) {
        this.currentClient.room = room;
        $(document).trigger("room:created");
        return promise.resolve(room);
      });
    });
  },
  closeRealTime: function(realtime) {
    var promise;
    promise = new AV.Promise;
    realtime.close();
    realtime.on('close', function() {
      promise.resolve();
      return $(document).trigger("realtime:closed");
    });
    return promise;
  }
};
