var YouYuChatBase;

YouYuChatBase = {
  appid: "2PKFqnCxPQ8DWMK2uiRWsQpz",
  secret: "Db8UOjtkzPgG1RrRHJSOPfth",
  msgTime: void 0,
  logFlag: false,
  log: [],
  currentClient: {
    room_name: "qiniuLive",
    client_id: "游客"
  },
  optState: function() {
    var state;
    state = {
      a: 1,
      b: 2
    };
    return {
      setState: function(key, value) {
        return state[key] = value;
      },
      getState: function(key) {
        return state[key];
      }
    };
  },
  createRealtime: function(client_id) {
    var result;
    if (!_.isUndefined(client_id)) {
      this.currentClient.client_id = client_id;
    }
    result = AV.realtime({
      appId: this.appid,
      clientId: this.currentClient.room_name + ':' + this.currentClient.client_id,
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
          _this.currentClient.members = response[0].attributes.m;
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
          _this.currentClient.room = room;
          $(document).trigger("room:connected");
          return promise.resolve(room);
        });
      };
    })(this));
  },
  createRoom: function(room_name, client_id) {
    var promise, realtime;
    promise = new AV.Promise;
    this.createRealtime(client_id);
    realtime = this.currentClient.realtime;
    this.currentClient.room_name = room_name;
    this.currentClient.client_id = client_id;
    return realtime.on('open', (function(_this) {
      return function() {
        return realtime.room({
          name: _this.currentClient.room_name,
          attr: {
            room_id: _this.currentClient.room_name
          },
          members: [_this.currentClient.room_name + ":" + _this.currentClient.client_id]
        }, function(room) {
          _this.currentClient.room = room;
          $(document).trigger("room:created");
          return promise.resolve(room);
        });
      };
    })(this));
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
  },
  getLog: function(room) {
    var promise;
    promise = new AV.Promise;
    this.room = room;
    if (this.logFlag) {
      return;
    } else {
      this.logFlag = true;
    }
    room.log({
      t: this.msgTime
    }, (function(_this) {
      return function(data) {
        var l;
        _this.logFlag = false;
        l = data.length;
        if (l) {
          _this.msgTime = data[0].timestamp;
          data.reverse();
        }
        _this.log = data;
        $(document).trigger("log:got");
        return promise.resolve(data);
      };
    })(this));
    return promise;
  },
  clearRoomMembers: function(room) {
    return room.list(function(data) {
      return room.remove(data, function() {
        return console.log("clearn room members");
      });
    });
  }
};
