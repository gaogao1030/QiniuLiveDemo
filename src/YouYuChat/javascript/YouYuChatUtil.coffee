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
      coverText: $(".cover-text")

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

    getSliceCount: ->
      slice_count = []
      init_count = 0
      return sliceCount = (length)->
        if init_count >= length
          return slice_count
        else
          init_count = init_count+20
          slice_count.push init_count
          sliceCount(length)

    getSliceMember: (members,slice_count)->
      slice_members = []
      init_count = 0
      _.each(slice_count,(count)->
        slice_members.push members.slice(init_count,count)
        init_count = count
      )
      return slice_members

    fetchOnlineUser: ->
      promise = new AV.Promise
      conv = AV.Object.extend('_conversation')
      q = new AV.Query(conv)
      q.equalTo('attr.room_id',base.baseState.get('room_name'))
      q.find({
        success: (response) =>
          conv_id = response[0]?.id||"null"
          base.baseState.set("members",response[0].attributes.m)
          realtime = base.baseState.get('realtime')
          members = base.baseState.get('members')
          m_count = members.length
          online_members = []
          sliceCount = @getSliceCount()
          slice_count = sliceCount(m_count)
          should_ping_count = slice_count.length
          current_ping_count = 0
          slice_members = @getSliceMember(members,slice_count)
          _.each(slice_members,(members)->
            realtime.ping(members,(data)->
              current_ping_count += 1
              online_members.push data
              if current_ping_count == should_ping_count
                online_members = _.flatten online_members
                base.baseState.set("online_members",online_members)
                promise.resolve(base.baseState.get("online_members"))
                $(document).trigger("fetchOnlineUser:done")
            )
          )
        error: (err)=>
      })
      return promise
  }
