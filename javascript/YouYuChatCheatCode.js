_.extend(YouYuChatUtil, {
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
          base.baseState.set('white_list_open', res[0].attributes.white_list_open);
          return base.baseState.set('broad_cast', res[0].attributes.broad_cast);
        };
      })(this)
    });
  },
  setCheatCode: function(commnad, attr, permit) {
    var code, key, room, text, white_list;
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
        case 'whiteListGet':
          return base.baseState.get("white_list");
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
              text = "白名单里删除了" + attr;
              base.baseState.set("white_list", white_list);
              return base.baseState.get('room').send({
                text: text,
                attr: {
                  msgLevel: "system",
                  userReload: key
                }
              }, {
                type: 'text'
              }, function(data) {});
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
        case 'broadCastSet':
          code.set("broad_cast", attr);
          base.baseState.set("broad_cast", attr);
          return code.save({
            success: function() {
              return console.log("通知更改完成");
            }
          });
        case 'broadCastPush':
          text = base.baseState.get("broad_cast");
          util.showBroadCast({
            msg: {
              text: text
            }
          });
          return base.baseState.get('room').send({
            text: text,
            attr: {
              msgLevel: "broad_cast"
            }
          }, {
            type: 'text',
            transient: true
          }, function(data) {});
        case 'getOnlineMemberCount':
          room = base.baseState.get('room');
          return room.count(function(data) {
            return console.log(data);
          });
        default:
          return console.log("no command");
      }
    } else {
      return console.log("permit denied");
    }
  }
});

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

window.listget = function(token) {
  return util.setCheatCode("whiteListGet", "", token);
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

window.castset = function(token, msg) {
  return util.setCheatCode("broadCastSet", msg, token);
};

window.castpush = function(token, msg) {
  return util.setCheatCode("broadCastPush", "", token);
};

window.onlineCount = function(token) {
  return util.setCheatCode("getOnlineMemberCount", "", token);
};
