YouYuChatState = require './YouYuChatState'
youyu_chat_state = new YouYuChatState
md5 = require 'md5'

module.exports = ->
  YouYuChatBase = {
    baseState: do ->
      return {
        set: (key,value)->
          youyu_chat_state[key]=value
        get: (key)->
          youyu_chat_state[key]
      }

    createRealtime : (client_id)->
      @baseState.set("client_id",client_id) unless _.isUndefined(client_id)
      if @baseState.get('white_list_open')
        name = md5(@baseState.get("client_id"))
      else
        name = @baseState.get("client_id")
      result = AV.realtime
        appId: @baseState.get('appid')
        clientId: @baseState.get('room_name') + ':' + name
        secure: false
      @baseState.set("realtime",result)
      return result

    getConversation : ->
      promise = new AV.Promise
      AV.initialize(@baseState.get('appid'),@baseState.get('appkey'))
      conv = AV.Object.extend('_conversation')
      q = new AV.Query(conv)
      q.equalTo('attr.room_id',@baseState.get('room_name'))
      q.find({
        success: (response) =>
          conv_id = response[0]?.id||"null"
          @baseState.set("members",response[0].attributes.m)
          @baseState.set("conv_id",conv_id)
          $(document).trigger("conversation_id:Got")
          promise.resolve(conv_id)
        error: (err)=>
          promise.reject(err)
      })
      return promise

    connectRoom : ->
      promise = new AV.Promise
      @createRealtime()
      realtime = @baseState.get('realtime')
      realtime.on 'open',=>
        realtime.room(@baseState.get('conv_id'),(room)=>
          @baseState.set("room",room)
          $(document).trigger("room:connected")
          return promise.resolve(room)
        )

    createRoom : (room_name,client_id)->
      promise = new AV.Promise
      @createRealtime(client_id)
      realtime = @baseState.get("realtime")
      @baseState.set("room_name",room_name)
      @baseState.set("client_id",client_id)
      realtime.on 'open',=>
        realtime.room({
          name: @baseState.get('room_name')
          attr: {room_id: @baseState.get('room_name')}
          members: [
            @baseState.get('room_name') + ":" + util.parseClientIdToName(@baseState.get("client_id"))
          ]
        },
        (room) =>
          @baseState.set('room',room)
          $(document).trigger("room:created")
          return promise.resolve(room)
        )

    closeRealTime : (realtime) ->
      promise = new AV.Promise
      realtime.close()
      realtime.on 'close',->
        promise.resolve()
        $(document).trigger("realtime:closed")
      return promise

    getLog : (room) ->
      promise  = new AV.Promise
      @baseState.set('room',room)
      if (@baseState.get('logFlag'))
          return
      else
        # 标记正在拉取
        @baseState.set('logFlag',true)
      room.log({
        t: @baseState.get('msgTime')
      }
      (data)=>
        @baseState.set('logFlag',false)
        # 存储下最早一条的消息时间戳
        l = data.length
        if(l)
          @baseState.set('msgTime',data[0].timestamp)
          data.reverse()
        @baseState.set('log',data)
        $(document).trigger("log:got")
        promise.resolve(data)
      )
      return promise

    clearRoomMembers : (room) ->
      room.list (data) ->
        room.remove(data,->
          console.log "clearn room members"
        )
  }

