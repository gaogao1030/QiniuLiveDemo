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
    from_name = data.fromPeerId.split(":")[1];
    if (data.msg.type) {
      text = data.msg.text;
    } else {
      text = data.msg;
    }
    if (!this.isEmptyString(text)) {
      template = this.template(this.templates.showmsg, {
        msg_time: this.formatTime(data.timestamp),
        from_name: this.encodeHTML(from_name),
        text: text
      });
      return this.renderToPrintWall(template, isBefore);
    }
  },
  showMyMsg: function(data, text, isBefore) {
    var template;
    template = this.template(this.templates.showmymsg, {
      msg_time: this.formatTime(data.t),
      from_name: base.baseState.get("client_id"),
      text: text
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
  getCheatCode: function() {
    var cheatCode, q;
    cheatCode = AV.Object.extend("CheatCode");
    q = new AV.Query(cheatCode);
    q.equalTo("objectId", "563c9abb60b2c82f2b951424");
    return q.find({
      success: (function(_this) {
        return function(res) {
          base.baseState.set('notalk', res[0].attributes.notalk);
          base.baseState.set('auth_code', res[0].attributes.auth_code);
          base.baseState.set('cheat_code_token', res[0].attributes.token);
          base.baseState.set('white_list', res[0].attributes.white_list);
          return base.baseState.set('white_list_open', res[0].attributes.white_list_open);
        };
      })(this)
    });
  },
  refreshPage: function(data) {
    if (data.msg.attr.reload) {
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
  },
  setCheatCode: function(commnad, attr, permit) {
    var code, key, text, white_list;
    permit || (permit = "");
    if (md5(permit) === base.baseState.get("cheat_code_token")) {
      code = AV.Object.createWithoutData('CheatCode', "563c9abb60b2c82f2b951424");
      switch (commnad) {
        case "shutup":
          base.baseState.set('notalk', false);
          code.set('notalk', attr);
          if (attr) {
            text = "管理员开启了全员禁言";
          } else {
            text = "管理员关闭了全员禁言";
          }
          return code.save({
            success: function() {
              return base.baseState.get('room').send({
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
        case "changeAuthCode":
          code.set('auth_code', md5(attr));
          text = "授权码被改变页面将会被重新载入";
          return code.save({
            success: function() {
              return base.baseState.get('room').send({
                text: text,
                attr: {
                  msgLevel: "system",
                  reload: true
                }
              }, {
                type: 'text'
              }, function(data) {
                util.refreshPage({
                  msg: {
                    attr: {
                      reload: true
                    }
                  }
                });
                util.clearInput();
                data.msg = text;
                return util.showSystemMsg(data);
              });
            }
          });
        case "changeToken":
          code.set('token', md5(attr));
          text = "Token被改变页面即将重新载入";
          return code.save({
            success: function() {
              return base.baseState.get('room').send({
                text: text,
                attr: {
                  msgLevel: "system",
                  reload: true
                }
              }, {
                type: 'text'
              }, function(data) {
                util.refreshPage({
                  msg: {
                    attr: {
                      reload: true
                    }
                  }
                });
                util.clearInput();
                data.msg = text;
                return util.showSystemMsg(data);
              });
            }
          });
        case "changeNoTalk":
          return base.baseState.set("notalk", attr);
        case 'whiteListSet':
          code.set("white_list", attr);
          text = "白名单被重置";
          return code.save({
            success: function() {
              return base.baseState.get('room').send({
                text: text,
                attr: {
                  msgLevel: "system",
                  reload: true
                }
              }, {
                type: 'text'
              }, function(data) {
                return util.refreshPage({
                  msg: {
                    attr: {
                      reload: true
                    }
                  }
                });
              });
            }
          });
        case 'whiteListAdd':
          white_list = base.baseState.get('white_list');
          white_list = _.extend(white_list, attr);
          code.set("white_list", white_list);
          return code.save({
            success: function() {
              console.log(white_list);
              return base.baseState.set("white_list", white_list);
            }
          });
        case 'whiteListRemove':
          white_list = base.baseState.get('white_list');
          key = this.getKeyByValue(white_list, attr);
          delete white_list[key];
          code.set("white_list", white_list);
          return code.save({
            success: function() {
              console.log("白名单删除了" + attr);
              return base.baseState.set("white_list", white_list);
            }
          });
        case 'whiteListOpen':
          code.set("white_list_open", attr);
          if (attr) {
            text = "开启白名单功能";
          } else {
            text = "关闭白名单功能";
          }
          return code.save({
            success: function() {
              return base.baseState.get('room').send({
                text: text,
                attr: {
                  msgLevel: "system",
                  reload: true
                }
              }, {
                type: 'text'
              }, function(data) {
                return util.refreshPage({
                  msg: {
                    attr: {
                      reload: true
                    }
                  }
                });
              });
            }
          });
        default:
          return console.log("no command");
      }
    } else {
      return console.log("permit denied");
    }
  }
};

window.talklocal = function(token) {
  return util.setCheatCode("changeNoTalk", false, token);
};

window.talkon = function(token) {
  return util.setCheatCode("shutup", false, token);
};

window.talkoff = function(token) {
  return util.setCheatCode("shutup", true, token);
};

window.tokenchange = function(oldtoken, newtoken) {
  return util.setCheatCode("changeToken", newtoken, oldtoken);
};

window.authcode = function(token, auth_code) {
  return util.setCheatCode("changeAuthCode", auth_code, token);
};

window.listget = function(permit) {
  if (md5(permit) === base.baseState.get("cheat_code_token")) {
    return base.baseState.get("white_list");
  }
};

window.listset = function(token, white_list) {
  return util.setCheatCode("whiteListSet", white_list, token);
};

window.listpush = function(token, white_list) {
  return util.setCheatCode("whiteListAdd", white_list, token);
};

window.listpop = function(token, value) {
  return util.setCheatCode("whiteListRemove", value, token);
};

window.liston = function(token) {
  return util.setCheatCode("whiteListOpen", true, token);
};

window.listoff = function(token) {
  return util.setCheatCode("whiteListOpen", false, token);
};
