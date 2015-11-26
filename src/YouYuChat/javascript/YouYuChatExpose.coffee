YouYuChatCheatCode = require './YouYuChatCheatCode'
YouYuChatUtil = require './YouYuChatUtil'
cheat_code = new YouYuChatCheatCode
util = new YouYuChatUtil

module.exports = do ->
  window.talklocal = (token)->
    cheat_code.setCheatCode("changeNoTalk",false,token)

  window.talkon = (token)->
    cheat_code.setCheatCode("shutup",false,token)

  window.talkoff = (token)->
    cheat_code.setCheatCode("shutup",true,token)

  window.tokenchange = (oldtoken,newtoken)->
    cheat_code.setCheatCode("changeToken",newtoken,oldtoken)

  window.authcode = (token,auth_code)->
    cheat_code.setCheatCode("changeAuthCode",auth_code,token)

  window.listget = (token,attr) ->
    attr ||= false
    cheat_code.setCheatCode("whiteListGet",{save_as_file: attr},token)

  window.listset = (token,white_list) ->
    cheat_code.setCheatCode("whiteListSet",white_list,token)

  window.listpush = (token,white_list) ->
    cheat_code.setCheatCode("whiteListAdd",white_list,token)

  window.listpop = (token,value) ->
    cheat_code.setCheatCode("whiteListRemove",value,token)

  window.liston = (token) ->
    cheat_code.setCheatCode("whiteListOpen",true,token)

  window.listoff = (token) ->
    cheat_code.setCheatCode("whiteListOpen",false,token)

  window.castset = (token,msg) ->
    cheat_code.setCheatCode("broadCastSet",msg,token)

  window.castpush = (token,msg) ->
    cheat_code.setCheatCode("broadCastPush","",token)

  window.onlineuser = (token) ->
    cheat_code.setCheatCode("getOnlineUser","",token)

  window.onlineusercount = (token) ->
    cheat_code.setCheatCode("getOnlineUserCount","",token)

  window.noticeset = (token,attr) ->
    cheat_code.setCheatCode("noticeSet",attr,token)

  window.screentoggle = ->
    $livearea = $(".live-area")
    $chatarea = $(".chat-area")
    $livearea.toggleClass("remove")
    $chatarea.toggleClass("full")

