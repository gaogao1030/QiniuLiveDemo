var YouYuChatUtil;

YouYuChatUtil = {
  template: function($template, obj) {
    var template;
    template = $template.html();
    return _.template(template)(obj);
  },
  isVisitor: function() {
    var blacklist;
    blacklist = ["游客", ""];
    if (_.indexOf(blacklist, base.baseState.get('client_id')) !== -1) {
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
  renderToPrintWall: function(template, isBefore) {
    var printWall;
    printWall = this.elements.printWall;
    printWall.scrollTop(printWall[0].scrollHeight);
    if (isBefore) {
      $(template).insertBefore(printWall.children()[0]);
    } else {
      printWall.append(template);
    }
    return this.scrollToBottomPrintWall();
  },
  showInfo: function(msg) {
    var template;
    template = this.template(this.templates.showinfo, {
      msg: msg
    });
    return this.renderToPrintWall(template);
  },
  showLog: function(msg, isBefore) {
    var template;
    template = this.template(this.templates.showlog, {
      msg: this.encodeHTML(msg)
    });
    return this.renderToPrintWall(template, isBefore);
  },
  encodeHTML: function(source) {
    return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  isEmptyString: function(string) {
    if (String(string).replace(/^\s+/, '').replace(/\s+$/, '') !== "") {
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
    var from, from_name, template, text;
    text = '';
    from = data.fromPeerId;
    from_name = from.split(":")[1];
    from_name = this.parseClientIdToName(from_name);
    if (data.msg.type) {
      text = data.msg.text;
    } else {
      text = data.msg;
    }
    if (!this.isEmptyString(text)) {
      template = this.template(this.templates.showmsg, {
        msg_time: this.formatTime(data.timestamp),
        from_name: this.encodeHTML(from_name),
        text: this.encodeHTML(text)
      });
      return this.renderToPrintWall(template, isBefore);
    }
  },
  showMyMsg: function(data, text, isBefore) {
    var template;
    template = this.template(this.templates.showmymsg, {
      msg_time: this.formatTime(data.t),
      from_name: util.parseClientIdToName(base.baseState.get('client_id')),
      text: this.encodeHTML(text)
    });
    return this.renderToPrintWall(template, isBefore);
  },
  showSystemMsg: function(data, isBefore) {
    var template, text;
    if (data.msg.type) {
      text = data.msg.text;
    } else {
      text = data.msg;
    }
    template = this.template(this.templates.showsystemmsg, {
      text: text
    });
    return this.renderToPrintWall(template, isBefore);
  },
  showChatLog: function() {
    var log, printWall;
    log = base.baseState.get('log');
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
  parseClientIdToName: function(client_id) {
    var name, white_list, white_list_open;
    white_list_open = base.baseState.get('white_list_open');
    white_list = base.baseState.get('white_list');
    if (white_list_open) {
      name = white_list[client_id];
      if (_.isUndefined(name)) {
        return client_id;
      }
      return name;
    } else {
      return client_id;
    }
  },
  refreshPage: function(data) {
    if (data.msg.attr.reload) {
      return window.location.reload();
    } else if (data.msg.attr.userReload === base.baseState.get('client_id')) {
      return window.location.reload();
    }
  },
  parseMsgLevel: function(data) {
    return data.msg.attr.msgLevel;
  },
  getKeyByValue: function(obj, v) {
    var keys;
    keys = _.map(obj, function(value, key) {
      if (value === v) {
        return key;
      }
    });
    return _.compact(keys)[0];
  },
  inWhiteList: function(code) {
    return _.has(base.baseState.get("white_list"), code);
  }
};
