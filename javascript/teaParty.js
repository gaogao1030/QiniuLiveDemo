var app_id, bindEvent, clear_members, client_id, close_connect, connect, elements, encodeHTML, formatTime, getLog, get_conversation, get_member, get_online_members, main, member_name, msgTime, newRoom, pressEnter, roomname, secret_key, sendMsg, showLog, showMsg, start, timeoutPromise;

app_id = void 0;

secret_key = void 0;

msgTime = void 0;

roomname = "qiniuLiveDemo";

member_name = void 0;

newRoom = void 0;

client_id = "游客";

this.chat_demo = {};

elements = {};

start = function(appid, secret_key) {
  elements = {
    body: $("body"),
    printWall: $("#printWall"),
    sendMsgBtn: $("#btnSend"),
    inputSend: $("#chatInput"),
    inputNickName: $("#inputNickName"),
    confirmName: $("#confirmName"),
    changeName: $("#changeName")
  };
  AV.initialize(appid, secret_key);
  roomname = "qiniuLiveDemo";
  app_id = appid;
  secret_key = secret_key;
  return get_conversation().then(function(conv_id) {
    return main(roomname, conv_id, client_id);
  }, function(err) {
    return console.log("Error: " + error.code + " " + error.message);
  });
};

connect = function(roomname, conv_id, client_id) {
  var promise, rt;
  rt = AV.realtime({
    appId: app_id,
    clientId: roomname + ":" + client_id,
    secure: false
  });
  promise = new AV.Promise;
  rt.on('open', function() {
    return rt.room(conv_id, function(obj) {
      return promise.resolve(rt, obj);
    });
  });
  return promise;
};

close_connect = function(rt) {
  var promise;
  promise = new AV.Promise;
  rt.close();
  rt.on('close', function() {
    return promise.resolve();
  });
  return promise;
};

get_conversation = function() {
  var conv, promise, q;
  promise = new AV.Promise;
  conv = AV.Object.extend('_conversation');
  q = new AV.Query(conv);
  q.equalTo('attr.room_id', roomname);
  q.find({
    success: function(response) {
      var conv_id, ref;
      conv_id = ((ref = response[0]) != null ? ref.id : void 0) || "null";
      return promise.resolve(conv_id);
    },
    error: function(err) {
      return promise.reject(err);
    }
  });
  return promise;
};

bindEvent = function(rt, room) {
  elements.body.on('keydown', function(e) {
    return pressEnter(e, room);
  });
  elements.sendMsgBtn.on('click', function() {
    return sendMsg();
  });
  elements.inputSend.on('click', function() {
    if (client_id === "游客") {
      return elements.changeName.modal("show");
    }
  });
  return elements.confirmName.on("click", function() {
    var printWall;
    client_id = elements.inputNickName.val();
    printWall = elements.printWall;
    if (!String(client_id).replace(/^\s+/, '').replace(/\s+$/, '')) {
      return alert("昵称不能为空");
    } else {
      return get_conversation().then(function(conv_id) {
        return connect(roomname, conv_id, client_id).then(function(rt, room) {
          newRoom = room;
          return room.join(function() {
            printWall.scrollTop(printWall[0].scrollHeight);
            if (client_id !== "游客") {
              showLog('你已经可以发送消息了。');
            }
            return elements.changeName.modal('hide');
          });
        });
      }, function(err) {
        return console.log("Error: " + error.code + " " + error.message);
      });
    }
  });
};

showLog = function(msg, data, isBefore) {
  var p, printWall;
  printWall = elements.printWall;
  printWall.scrollTop(printWall[0].scrollHeight);
  if (data) {
    msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
  }
  p = document.createElement('p');
  p.innerHTML = msg;
  if (isBefore) {
    return $(p).insertBefore(printWall.children()[0]);
  } else {
    return printWall.append(p);
  }
};

pressEnter = function(e, room) {
  if (e.keyCode === 13) {
    return sendMsg();
  }
};

encodeHTML = function(source) {
  return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

sendMsg = function() {
  var inputSend, msg, printWall;
  inputSend = elements.inputSend;
  printWall = elements.printWall;
  msg = inputSend.val();
  if (!String(msg).replace(/^\s+/, '').replace(/\s+$/, '')) {
    alert('请输入点文字！');
    return;
  } else if (client_id === "游客") {
    alert("你当前的身份是游客不能发言");
    return;
  }
  return newRoom.send({
    text: msg
  }, {
    type: 'text'
  }, function(data) {
    inputSend.val('');
    showLog(formatTime(data.t) + ' 我：', msg);
    return printWall.scrollTop(printWall[0].scrollHeight);
  });
};

getLog = function(room) {
  var height, logFlag, printWall, promise;
  promise = new AV.Promise;
  elements = elements;
  printWall = elements.printWall[0];
  height = printWall.scrollHeight;
  if (logFlag) {
    return;
  } else {
    logFlag = true;
  }
  room.log({
    t: msgTime
  }, function(data) {
    var l;
    logFlag = false;
    l = data.length;
    if (l) {
      msgTime = data[0].timestamp;
      printWall.scrollTop = printWall.scrollHeight - height;
      data.reverse();
    }
    _.each(data, function(d) {
      return showMsg(d, true);
    });
    return promise.resolve();
  });
  return promise;
};

showMsg = function(data, isBefore) {
  var from, from_name, text;
  text = '';
  from = data.fromPeerId;
  from_name = data.fromPeerId.split(":")[1];
  if (data.msg.type) {
    text = data.msg.text;
  } else {
    text = data.msg;
  }
  if (String(text).replace(/^\s+/, '').replace(/\s+$/, '') && from_name !== client_id) {
    return showLog(formatTime(data.timestamp) + ' ' + encodeHTML(from_name) + '： ', text, isBefore);
  }
};

formatTime = function(time) {
  var date;
  date = new Date(time);
  return $.format.date(date, "hh:mm:ss");
};

main = function(roomname, conv_id, client_id) {
  var printWall;
  printWall = elements.printWall;
  showLog("正在连接有渔直播聊天系统，请等待。。。");
  return connect(roomname, conv_id, client_id).then(function(rt, room) {
    bindEvent(rt, room);
    showLog('欢迎来到有渔直播间');
    room.join(function() {
      return getLog(room).then(function() {
        printWall.scrollTop(printWall[0].scrollHeight);
        if (client_id !== "游客") {
          return showLog('已经加入，可以开始聊天。');
        }
      });
    });
    room.receive(function(data) {
      printWall.scrollTop(printWall[0].scrollHeight);
      if (!msgTime) {
        msgTime = data.timestamp;
      }
      return showMsg(data);
    });
    rt.on('reuse', function() {
      return showLog("正在重新连接有渔直播聊天系统");
    });
    rt.on('error', function() {
      showLog('好像有什么不对劲 请打开console 查看相关日志 ');
      return console.log(rt);
    });
    rt.on('join', function(res) {
      return _.each(res.m, function(m) {
        var name;
        name = m.split(":")[1];
        if (name !== client_id) {
          return showLog(name + '加入有渔直播间');
        }
      });
    });
    return rt.on('left', function(res) {
      return console.log(res);
    });
  });
};

clear_members = function() {
  return room.list(function(data) {
    return room.remove(data, function() {
      return console.log("clear_members");
    });
  });
};

get_online_members = function(rt, room, opt) {
  var online_members, promise;
  if (opt == null) {
    opt = {};
  }
  online_members = [];
  promise = new AV.Promise;
  room.list(function(data) {
    var j, range, ref, results;
    range = (function() {
      results = [];
      for (var j = 0, ref = parseInt(data.length / 20); 0 <= ref ? j <= ref : j >= ref; 0 <= ref ? j++ : j--){ results.push(j); }
      return results;
    }).apply(this);
    return _.each(range, function(i) {
      var p_data;
      p_data = data.slice(i * 20, (i + 1) * 20);
      return rt.ping(p_data, function(list) {
        _.each(list, function(d) {
          return online_members.push(d);
        });
        return promise.resolve(online_members);
      });
    });
  });
  return timeoutPromise(promise, 10000);
};

get_member = function(rt, room) {
  var promise;
  promise = new AV.Promise;
  get_online_members(rt, room).then(function(online_members) {
    var c_members, online_list, ref;
    online_list = online_members.map(function(d) {
      return originClientId(d);
    });
    c_members = _.clone(members);
    _.each(online_list, function(m) {
      var member;
      member = clientIdToMember(m);
      return c_members = _.without(c_members, member);
    });
    client_id = (ref = c_members[0]) != null ? ref.clientId : void 0;
    return promise.resolve(client_id);
  });
  return promise;
};

timeoutPromise = function(promise, ms) {
  var delayPromise, timeout_promise;
  delayPromise = function() {
    return new AV.Promise(function(resolve) {
      return setTimeout(resolve, ms);
    });
  };
  timeout_promise = delayPromise(ms).then(function() {
    return Promise.reject(new Error("请求超时"));
  });
  return AV.Promise.race([promise, timeout_promise]);
};

this.chat_demo.get_member = function() {
  return get_conversation().then(function(conv_id) {
    return connect(roomname, conv_id, "leanCloud").then(function(rt, conv) {
      return get_member(rt, conv).then(function(client_id) {
        console.log(client_id);
        return close_connect(rt);
      });
    });
  });
};

this.chat_demo.get_online_members = function() {
  return get_conversation().then(function(conv_id) {
    return connect(roomname, conv_id, "leanCloud").then(function(rt, conv) {
      return get_online_members(rt, conv).then(function(list) {
        console.log(list);
        return close_connect(rt);
      });
    });
  });
};

this.chat_demo.get_conversation = get_conversation;

this.chat_demo.start = start;

this.chat_demo.clear_members = clear_members;

this.chat_demo.connect = connect;
