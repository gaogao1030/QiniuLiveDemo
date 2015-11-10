var YouYuChatBase;

YouYuChatBase = {
  baseState: (function() {
    var state;
    state = {
      appid: "2PKFqnCxPQ8DWMK2uiRWsQpz",
      secret: "Db8UOjtkzPgG1RrRHJSOPfth",
      msgTime: void 0,
      logFlag: false,
      log: [],
      room_name: "qiniuLive",
      client_id: "游客"
    };
    return {
      set: function(key, value) {
        return state[key] = value;
      },
      get: function(key) {
        return state[key];
      }
    };
  })(),
  createRealtime: function(client_id) {
    var result;
    if (!_.isUndefined(client_id)) {
      this.baseState.set("client_id", client_id);
    }
    result = AV.realtime({
      appId: this.baseState.get('appid'),
      clientId: this.baseState.get('room_name') + ':' + this.baseState.get("client_id"),
      secure: false
    });
    this.baseState.set("realtime", result);
    return result;
  },
  getConversation: function() {
    var conv, promise, q;
    promise = new AV.Promise;
    AV.initialize(this.baseState.get('appid'), this.baseState.get('secret'));
    conv = AV.Object.extend('_conversation');
    q = new AV.Query(conv);
    q.equalTo('attr.room_id', this.baseState.get('room_name'));
    q.find({
      success: (function(_this) {
        return function(response) {
          var conv_id, ref;
          conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
          _this.baseState.set("members", response[0].attributes.m);
          _this.baseState.set("conv_id", conv_id);
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
    realtime = this.baseState.get('realtime');
    return realtime.on('open', (function(_this) {
      return function() {
        return realtime.room(_this.baseState.get('conv_id'), function(room) {
          _this.baseState.set("room", room);
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
    realtime = this.baseState.get("realtime");
    this.baseState.set("room_name", room_name);
    this.baseState.set("client_id", client_id);
    return realtime.on('open', (function(_this) {
      return function() {
        return realtime.room({
          name: _this.baseState.get('room_name'),
          attr: {
            room_id: _this.baseState.get('room_name')
          },
          members: [_this.baseState.get('room_name') + ":" + _this.baseState.get("client_id")]
        }, function(room) {
          _this.baseState.set('room', room);
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
    this.baseState.set('room', room);
    if (this.baseState.get('logFlag')) {
      return;
    } else {
      this.baseState.set('logFlag', true);
    }
    room.log({
      t: this.baseState.get('msgTime')
    }, (function(_this) {
      return function(data) {
        var l;
        _this.baseState.set('logFlag', false);
        l = data.length;
        if (l) {
          _this.baseState.set('msgTime', data[0].timestamp);
          data.reverse();
        }
        _this.baseState.set('log', data);
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
