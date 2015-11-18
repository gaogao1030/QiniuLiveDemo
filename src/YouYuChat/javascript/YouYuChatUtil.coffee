YouYuChatBase = require './YouYuChatBase'
base = new YouYuChatBase
module.exports = ->
  YouYuChatUtil = {
    elements: ->
      body: $("body")
      printWall: $("#printWall")
      sendMsgBtn: $("#btnSend")
      inputSend: $("#chatInput")
      inputNickName: $("#inputNickName")
      confirmName: $("#confirmName")
      changeName: $("#changeName")
      chatArea: $(".chat-area")
      modalDialog: $(".modal-dialog")

    templates: ->
      showlog: $("#showlog")
      showmsg: $("#showmsg")
      showsystemmsg: $("#showsystemmsg")
      showmymsg: $("#showmymsg")
      showinfo: $("#showinfo")


    template: ($template,obj)->
      template = $template.html()
      _.template(template)(obj)

    isVisitor: ->
      blacklist = ["游客",""  ]
      if ( _.indexOf(blacklist,base.baseState.get('client_id')) != -1 )
        return true
      return false


    timeoutPromise: (promise,ms) ->
      delayPromise = ->
        return new AV.Promise(
          (resolve) ->
            setTimeout(resolve,ms)
        )
      timeout_promise = delayPromise(ms).then(
        ->
          Promise.reject(new Error("请求超时"))
      )
      return AV.Promise.race([promise,timeout_promise])

    formatTime: (time)->
      date = new Date(time)
      #return $.format.date(date,"yyyy-MM-dd hh:mm:ss")
      return $.format.date(date,"hh:mm:ss")

    renderToPrintWall: (template,isBefore) ->
      printWall = @elements().printWall
      printWall.scrollTop(printWall[0].scrollHeight)
      if (isBefore)
        $(template).insertBefore(printWall.children()[0])
      else
        printWall.append(template)
      @scrollToBottomPrintWall()

    showInfo:(msg) ->
      template = @template(@templates().showinfo,{msg:msg})
      @renderToPrintWall(template)

    showLog: (msg, isBefore) ->
      template = @template(@templates().showlog,{msg:@encodeHTML(msg)})
      @renderToPrintWall(template,isBefore)

    encodeHTML:(source) ->
      return String(source)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')

    isEmptyString: (string)->
      if String(string).replace(/^\s+/, '').replace(/\s+$/, '') != ""
        return false
      return true

    clearInput: ->
      @elements().inputSend.val('')

    scrollToBottomPrintWall: ->
      printWall = @elements().printWall
      printWall.scrollTop(printWall[0].scrollHeight)

    showMsg: (data, isBefore) ->
      text = ''
      from = data.fromPeerId
      from_name = from.split(":")[1]
      from_name = @parseClientIdToName(from_name)
      if(data.msg.type)
        text = data.msg.text
      else
        text = data.msg
      unless @isEmptyString(text)
        template = @template(@templates().showmsg,{msg_time:@formatTime(data.timestamp),from_name: @encodeHTML(from_name),text: @encodeHTML(text)})
        @renderToPrintWall(template,isBefore)

    showMyMsg: (data,text,isBefore) ->
      template = @template(@templates().showmymsg,{msg_time:@formatTime(data.t),from_name: @parseClientIdToName(base.baseState.get('client_id')),text: @encodeHTML(text)})
      @renderToPrintWall(template,isBefore)

    showBroadCast: (notice,isBefore) ->
      @renderToPrintWall(notice.msg.text,isBefore)

    showSystemMsg: (data,isBefore) ->
      if(data.msg.type)
        text = data.msg.text
      else
        text = data.msg
      template = @template(@templates().showsystemmsg,{text:text})
      @renderToPrintWall(template,isBefore)

    showChatLog: ->
      log = base.baseState.get('log')
      printWall = @elements().printWall
      _.each(log,(log) =>
        if @parseMsgLevel(log) == "member"
          @showMsg(log, true)
        #else if @parseMsgLevel(log) == "broad_cast" #broad_cast 设置为暂态消息不会有日志
        #  @showBroadCast(log, true)
        else
          @showSystemMsg(log, true)
      )

    parseClientIdToName: (client_id)->
      white_list_open = base.baseState.get('white_list_open')
      white_list = base.baseState.get('white_list')
      if white_list_open
        name = white_list[client_id]
        return client_id if _.isUndefined name
        return name
      else
        return client_id

    refreshPage: (data) ->
      if data.msg.attr.reload
        window.location.reload()
      else if data.msg.attr.userReload == base.baseState.get('client_id')
        window.location.reload()

    parseMsgLevel: (data) ->
      return data.msg.attr.msgLevel

    getKeyByValue: (obj,v) ->
      keys = _.map(obj,
        (value,key)->
          return key if value == v
      )
      return _.compact(keys)[0]

    inWhiteList: (code) ->
      return _.has(base.baseState.get("white_list"),code)

  }
