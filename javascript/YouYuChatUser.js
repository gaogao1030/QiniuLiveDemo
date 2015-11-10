var userAccess;

userAccess = function() {
  $(document).on("user:started", function() {
    return console.log("user:started");
  });
  $(document).on("user:room:connected", function() {
    var realtime, room;
    room = base.baseState.get('room');
    realtime = base.baseState.get('realtime');
    room.join(function() {
      return util.showLog("你的昵称为" + (base.baseState.get('client_id')) + ",已经可以发言了");
    });
    room.receive(function(data) {
      if (util.parseMsgLevel(data) === "member") {
        return util.showMsg(data);
      } else {
        return util.getCheatCode().then(function() {
          return util.showSystemMsg(data);
        });
      }
    });
    realtime.on('reuse', function() {
      return util.showLog("正在重新连接有渔直播聊天系统");
    });
    realtime.on('error', function() {
      return util.showLog('好像有什么不对劲 请打开console 查看相关日志 ');
    });
    realtime.on('kicked', function(res) {
      return console.log(res);
    });
    return realtime.on('join', function(res) {
      return _.each(res.m, function(m) {
        var name;
        name = m.split(":")[1];
        if (name !== base.baseState.get('client_id')) {
          return util.showLog(name + '加入有渔直播间');
        }
      });
    });
  });
  $(document).on("user:pressEnter", function() {
    var msg, room;
    msg = util.elements.inputSend.val();
    room = base.baseState.get('room');
    if (base.baseState.get('notalk')) {
      alert("目前是禁止发言状态");
    } else {
      if (!util.isEmptyString(msg)) {
        return room.send({
          text: msg,
          attr: {
            msgLevel: "member"
          }
        }, {
          type: 'text'
        }, function(data) {
          util.clearInput();
          return util.showLog((util.formatTime(data.t)) + " 我：", msg);
        });
      } else {
        alert("请输入点文字");
      }
    }
  });
  $(document).on("user:inputSend:click", function() {});
  return $(document).on("visitor:realtime:closed", function() {
    console.log("vistor realtime closed");
    return $(document).trigger("started");
  });
};
