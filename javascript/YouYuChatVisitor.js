var visitorAccess;

visitorAccess = function() {
  $(document).on("visitor:started", function() {
    return util.showLog("正在连接有渔直播室...");
  });
  $(document).on("visitor:room:connected", function() {
    var realtime, room;
    util.showLog("欢迎来到有渔直播室，你目前的身份是游客不可以发言");
    room = base.currentClient.room;
    realtime = base.currentClient.realtime;
    room.join(function() {
      return base.getLog(room);
    });
    room.receive(function(data) {
      if (util.parseMsgLevel(data) === "member") {
        return util.showMsg(data);
      } else {
        return util.showSystemMsg(data);
      }
    });
    realtime.on('reuse', function() {
      return util.showLog("正在重新连接有渔直播聊天系统");
    });
    realtime.on('error', function() {
      return util.showLog('好像有什么不对劲 请打开console 查看相关日志 ');
    });
    realtime.on('join', function(res) {
      return _.each(res.m, function(m) {
        var name;
        name = m.split(":")[1];
        if (name !== base.currentClient.client_id) {
          return util.showLog(name + '加入有渔直播间');
        }
      });
    });
    return realtime.on('kicked', function(res) {
      return console.log(res);
    });
  });
  $(document).on("visitor:pressEnter", function() {
    return alert("你目前的身份是游客不可以发言");
  });
  $(document).on("visitor:inputSend:click", function() {
    return util.elements.changeName.modal("show");
  });
  return $(document).on("visitor:confirmName:click", function() {
    var client_id;
    client_id = util.elements.inputNickName.val();
    base.currentClient.client_id = client_id;
    if (!util.isEmptyString(client_id)) {
      base.closeRealTime(base.currentClient.realtime);
      return util.elements.changeName.modal("hide");
    }
  });
};
