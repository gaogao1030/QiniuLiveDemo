YouYuChatBase = {
  appid: "2PKFqnCxPQ8DWMK2uiRWsQpz"
  secret: "Db8UOjtkzPgG1RrRHJSOPfth"

  currentClient : {
    room_name:"qiniuLiveDemo"
    #room
    client_id:"游客"
    #realtime
    #conv_id
  }

  createRealtime : ->
    result = AV.realtime
      appId: @appid
      clientId: @currentClient.roomname  + @currentClient.client_id
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
        $(document).trigger("room:connected")
        @currentClient.room = room
        return promise.resolve(room)
      )

  createRoom : (room_name,client_id)->
    promise = new AV.Promise
    @createRealtime()
    realtime = @currentClient.realtime
    @currentClient.room_name = room_name
    @currentClient.client_id = client_id
    realtime.on 'open',->
      realtime.room({
        name: @currentClient.room_name
        attr: {room_id: @currentClient.room_name}
        members: [
          @currentClient.room_name + ":" + @currentClient.member_name
        ]
      },
      (room) ->
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
}
