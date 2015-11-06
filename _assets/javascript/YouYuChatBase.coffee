YouYuChatBase = {
  appid: "2PKFqnCxPQ8DWMK2uiRWsQpz"
  secret: "Db8UOjtkzPgG1RrRHJSOPfth"
  msgTime: undefined
  logFlag: false
  log: []

  currentClient : {
    room_name:"qiniuLive"
    #room
    client_id:"游客"
    #realtime
    #conv_id
  }

  createRealtime : (client_id)->
    @currentClient.client_id = client_id unless _.isUndefined(client_id)
    result = AV.realtime
      appId: @appid
      clientId: @currentClient.room_name + ':' + @currentClient.client_id
      secure: false
    @currentClient.realtime = result
    return result

  getConversation : ->
    promise = new AV.Promise
    AV.initialize(@appid,@secret)
    conv = AV.Object.extend('_conversation')
    q = new AV.Query(conv)
    q.equalTo('attr.room_id',@currentClient.room_name)
    q.find({
      success: (response) =>
        conv_id = response[0]?.id||"null"
        @currentClient.conv_id = conv_id
        $(document).trigger("conversation_id:Got")
        promise.resolve(conv_id)
      error: (err)=>
        promise.reject(err)
    })
    return promise

  connectRoom : ->
    promise = new AV.Promise
    @createRealtime()
    realtime = @currentClient.realtime
    realtime.on 'open',=>
      realtime.room(@currentClient.conv_id,(room)=>
        @currentClient.room = room
        $(document).trigger("room:connected")
        return promise.resolve(room)
      )

  createRoom : (room_name,client_id)->
    promise = new AV.Promise
    @createRealtime(client_id)
    realtime = @currentClient.realtime
    @currentClient.room_name = room_name
    @currentClient.client_id = client_id
    realtime.on 'open',=>
      realtime.room({
        name: @currentClient.room_name
        attr: {room_id: @currentClient.room_name}
        members: [
          @currentClient.room_name + ":" + @currentClient.client_id
        ]
      },
      (room) =>
        @currentClient.room = room
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
    @room = room
    if (@logFlag)
        return
    else
      # 标记正在拉取
      @logFlag = true
    room.log({
      t: @msgTime
    }
    (data)=>
      @logFlag = false
      # 存储下最早一条的消息时间戳
      l = data.length
      if(l)
        @msgTime = data[0].timestamp
        data.reverse()
      @log = data
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
