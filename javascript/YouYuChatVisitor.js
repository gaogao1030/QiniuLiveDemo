var visitorAccess;

visitorAccess = function() {
  $(document).on("visitor:started", function() {
    return util.showLog("正在连接有渔直播室...");
  });
  $(document).on("visitor:room:connected", function() {
    var realtime, room;
    util.showLog("欢迎来到有渔直播室，请点击消息框输入您的姓名后再发言");
    room = base.baseState.get('room');
    realtime = base.baseState.get('realtime');
    room.join(function() {
      return base.getLog(room);
    });
    room.receive(function(data) {
      util.refreshPage(data);
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
        if (name !== base.baseState.get('client_id')) {
          return util.showLog(name + '加入有渔直播间');
        }
      });
    });
    return realtime.on('kicked', function(res) {
      return console.log(res);
    });
  });
  $(document).on("visitor:pressEnter", function() {
    return alert("你目前还未输入姓名，不可以发言");
  });
  $(document).on("visitor:inputSend:click", function() {
    return util.elements.changeName.modal("show");
  });
  return $(document).on("visitor:confirmName:click", function() {
    var client_id;
    client_id = util.elements.inputNickName.val();
    if (util.inWhiteList(client_id)) {
      base.baseState.set('client_id', client_id);
      if (!util.isEmptyString(client_id)) {
        base.closeRealTime(base.baseState.get('realtime'));
        return util.elements.changeName.modal("hide");
      }
    } else {
      return alert("你输入的昵称不在白名单中");
    }
  });
};
