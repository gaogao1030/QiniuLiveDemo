var YouYuChatUtil;

YouYuChatUtil = {
  isVisitor: function() {
    if (base.currentClient.client_id === "游客") {
      return true;
    }
    return false;
  },
  timeoutPromise: function(promise, ms) {
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
  },
  formatTime: function(time) {
    var date;
    date = new Date(time);
    return $.format.date(date, "hh:mm:ss");
  },
  showLog: function(msg, data, isBefore) {
    var p, printWall;
    printWall = this.elements.printWall;
    printWall.scrollTop(printWall[0].scrollHeight);
    if (data) {
      msg = msg + '<span class="strong">' + this.encodeHTML(JSON.stringify(data)) + '</span>';
    }
    p = document.createElement('p');
    p.innerHTML = msg;
    if (isBefore) {
      $(p).insertBefore(printWall.children()[0]);
    } else {
      printWall.append(p);
    }
    return this.scrollToBottomPrintWall();
  },
  encodeHTML: function(source) {
    return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  isEmptyString: function(string) {
    if (String(string).replace(/^\s+/, '').replace(/\s+$/, '')) {
      return false;
    }
    return true;
  },
  clearInput: function() {
    return this.elements.inputSend.val('');
  },
  scrollToBottomPrintWall: function() {
    var printWall;
    printWall = this.elements.printWall;
    return printWall.scrollTop(printWall[0].scrollHeight);
  },
  showMsg: function(data, isBefore) {
    var from, from_name, text;
    text = '';
    from = data.fromPeerId;
    from_name = data.fromPeerId.split(":")[1];
    if (data.msg.type) {
      text = data.msg.text;
    } else {
      text = data.msg;
    }
    if (!this.isEmptyString(text)) {
      return this.showLog(this.formatTime(data.timestamp) + ' ' + this.encodeHTML(from_name) + '： ', text, isBefore);
    }
  },
  showSystemMsg: function(data, isBefore) {
    var text;
    if (data.msg.type) {
      text = data.msg.text;
    } else {
      text = data.msg;
    }
    return this.showLog("<span class='red'>系统提示:" + text + "</span>", "", isBefore);
  },
  showChatLog: function() {
    var log, printWall;
    log = base.log;
    printWall = this.elements.printWall;
    return _.each(log, (function(_this) {
      return function(log) {
        if (_this.parseMsgLevel(log) === "member") {
          return _this.showMsg(log, true);
        } else {
          return _this.showSystemMsg(log, true);
        }
      };
    })(this));
  },
  getCheatCode: function() {
    var cheatCode, q;
    cheatCode = AV.Object.extend("CheatCode");
    q = new AV.Query(cheatCode);
    q.equalTo("objectId", "563c9abb60b2c82f2b951424");
    return q.find({
      success: (function(_this) {
        return function(res) {
          return base.notalk = res[0].attributes.notalk;
        };
      })(this)
    });
  },
  parseMsgLevel: function(data) {
    return data.msg.attr.msgLevel;
  },
  setCheatCode: function(attr, permit) {
    var code, text;
    if (md5(permit) === "c2fc2f64438b1eb36b7e244bdb7bd535") {
      base.notalk = false;
      code = AV.Object.createWithoutData('CheatCode', "563c9abb60b2c82f2b951424");
      code.set('notalk', attr);
      if (attr) {
        text = "管理员开启了全员禁言";
      } else {
        text = "管理员关闭了全员禁言";
      }
      return code.save({
        success: function() {
          return base.currentClient.room.send({
            text: text,
            attr: {
              msgLevel: "system"
            }
          }, {
            type: 'text'
          }, function(data) {
            util.clearInput();
            data.msg = text;
            return util.showSystemMsg(data);
          });
        }
      });
    } else {
      return console.log("permit denied");
    }
  }
};
