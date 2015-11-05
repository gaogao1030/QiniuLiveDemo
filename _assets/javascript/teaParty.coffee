app_id = undefined
secret_key = undefined
msgTime = undefined
roomname = "qiniuLiveDemo"
member_name = undefined
newRoom = undefined
client_id = "游客"
@chat_demo = {}


elements = {}
start = (appid,secret_key) ->
  elements = {
    body: $("body")
    printWall: $("#printWall")
    sendMsgBtn: $("#btnSend")
    inputSend: $("#chatInput")
    inputNickName: $("#inputNickName")
    confirmName: $("#confirmName")
    changeName: $("#changeName")
  }
  AV.initialize(appid,secret_key)
  roomname = "qiniuLiveDemo"
  app_id = appid
  secret_key = secret_key
  get_conversation().then(
    (conv_id)->
      main(roomname,conv_id,client_id)
    (err)->
      console.log("Error: " + error.code + " " + error.message)
  )

connect = (roomname,conv_id,client_id)->
  rt = AV.realtime({
    appId: app_id
    clientId: roomname+":"+client_id
    secure: false
  })
  promise = new AV.Promise
  rt.on('open',->
    rt.room(conv_id,(obj)->
      promise.resolve(rt,obj)
    )
  )
  return promise

close_connect = (rt)->
  promise = new AV.Promise
  rt.close()
  rt.on('close',->
    promise.resolve()
  )
  return promise


get_conversation = ->
  promise = new AV.Promise
  conv = AV.Object.extend('_conversation')
  q = new AV.Query(conv)
  q.equalTo('attr.room_id',roomname)
  q.find({
    success: (response) ->
      conv_id = response[0]?.id||"null"
      promise.resolve(conv_id)
    error: (err)->
      promise.reject(err)
  })
  return promise

bindEvent = (rt,room)->
  elements.body.on('keydown', (e)->
    pressEnter(e,room)
  )
  elements.sendMsgBtn.on('click', ->
    sendMsg()
  )
  elements.inputSend.on 'click', ->
    if client_id == "游客"
      elements.changeName.modal("show")

  elements.confirmName.on "click",->
    client_id = elements.inputNickName.val()
    printWall = elements.printWall
    if (!String(client_id).replace(/^\s+/, '').replace(/\s+$/, ''))
      alert "昵称不能为空"
    else
      get_conversation().then(
        (conv_id)->
          connect(roomname,conv_id,client_id).then(
            (rt,room) ->
              newRoom = room
              room.join(->
                printWall.scrollTop(printWall[0].scrollHeight)
                unless client_id == "游客"
                  showLog('你已经可以发送消息了。')
                elements.changeName.modal('hide')
              )
          )
        (err)->
          console.log("Error: " + error.code + " " + error.message)
      )


showLog = (msg, data, isBefore) ->
  printWall = elements.printWall
  printWall.scrollTop(printWall[0].scrollHeight)
  if (data)
    msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>'
  p = document.createElement('p')
  p.innerHTML = msg
  if (isBefore)
    $(p).insertBefore(printWall.children()[0])
  else
    printWall.append(p)

pressEnter = (e,room)->
  if e.keyCode == 13
    sendMsg()

encodeHTML=(source) ->
  return String(source)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')

sendMsg = ->
  inputSend = elements.inputSend
  printWall = elements.printWall
  msg = inputSend.val()
  if (!String(msg).replace(/^\s+/, '').replace(/\s+$/, ''))
    alert '请输入点文字！'
    return
  else if client_id=="游客"
    alert "你当前的身份是游客不能发言"
    return
  newRoom.send({
      text: msg
  },
  {
      type: 'text'
  },
  (data)->
      inputSend.val('')
      showLog(formatTime(data.t) + ' 我：', msg)
      printWall.scrollTop(printWall[0].scrollHeight)
  )

getLog = (room)->
  promise  = new AV.Promise
  elements = elements
  printWall = elements.printWall[0]
  height = printWall.scrollHeight
  if (logFlag)
      return
  else
    # 标记正在拉取
    logFlag = true
  room.log({
    t: msgTime
  }
  (data)->
    logFlag = false
    # 存储下最早一条的消息时间戳
    l = data.length
    if(l)
      msgTime = data[0].timestamp
      printWall.scrollTop = printWall.scrollHeight - height
      data.reverse()
    _.each(data,(d)->
      showMsg(d, true)
    )

    promise.resolve()
  )
  return promise

showMsg = (data, isBefore) ->
  text = ''
  from = data.fromPeerId
  from_name = data.fromPeerId.split(":")[1]
  if(data.msg.type)
    text = data.msg.text
  else
    text = data.msg
  if(String(text).replace(/^\s+/, '').replace(/\s+$/, '') && from_name!= client_id )
    showLog( formatTime(data.timestamp) + ' ' + encodeHTML(from_name) + '： ', text, isBefore)



formatTime=(time)->
  date = new Date(time)
  #return $.format.date(date,"yyyy-MM-dd hh:mm:ss")
  return $.format.date(date,"hh:mm:ss")

main = (roomname,conv_id,client_id)->
  printWall = elements.printWall
  showLog("正在连接有渔直播聊天系统，请等待。。。")

  connect(roomname,conv_id,client_id).then(
    (rt,room) ->
      bindEvent(rt,room)
      showLog('欢迎来到有渔直播间')
      room.join(->
        getLog(room).then(
          ->
            printWall.scrollTop(printWall[0].scrollHeight)
            unless client_id == "游客"
              showLog('已经加入，可以开始聊天。')
        )
      )
      room.receive((data)->
        printWall.scrollTop(printWall[0].scrollHeight)
        if !msgTime
          msgTime = data.timestamp
        showMsg(data)
      )

      rt.on('reuse',->
        showLog("正在重新连接有渔直播聊天系统")
      )

      rt.on('error',->
        showLog('好像有什么不对劲 请打开console 查看相关日志 ')
        console.log rt
      )

      rt.on('join',(res)->
        _.each(res.m, (m)->
          name = m.split(":")[1]
          unless name == client_id
            showLog(name + '加入有渔直播间')
        )
      )

      rt.on('left',(res)->
        console.log res
      )
  )


clear_members = ->
  room.list((data)->
    room.remove(data,->
      console.log "clear_members"
    )
  )

get_online_members = (rt,room,opt={})->
  online_members = []
  promise = new AV.Promise
  room.list((data)->
    range = [0..(parseInt(data.length/20)) ]
    _.each(range,(i)->
      p_data = data.slice(i*20,(i+1)*20)
      rt.ping(p_data, (list) ->
        _.each(list,(d)->
          online_members.push d
        )
        #opt.callback(online_members) if opt.callback
        promise.resolve(online_members)
      )
    )
  )
  return timeoutPromise(promise,10000) #default 10 seconds


get_member = (rt,room)->
  promise = new AV.Promise
  get_online_members(rt,room).then(
    (online_members)->
      online_list = online_members.map((d)->
        return originClientId(d)
      )
      c_members = _.clone(members)
      _.each(online_list, (m)->
        member = clientIdToMember(m)
        c_members = _.without(c_members,member)
      )
      client_id = c_members[0]?.clientId
      promise.resolve(client_id)
  )
  return promise

timeoutPromise = (promise,ms) ->
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

@chat_demo.get_member = ->
  get_conversation().then(
    (conv_id)->
      connect(roomname,conv_id,"leanCloud").then(
        (rt,conv) ->
          get_member(rt,conv).then(
            (client_id) ->
              console.log client_id
              close_connect(rt)
          )
      )
  )

@chat_demo.get_online_members = ->
  get_conversation().then(
    (conv_id)->
      connect(roomname,conv_id,"leanCloud").then(
        (rt,conv)->
          get_online_members(rt,conv).then(
            (list) ->
              console.log list
              close_connect(rt)
          )
      )
  )

@chat_demo.get_conversation = get_conversation
@chat_demo.start = start
@chat_demo.clear_members= clear_members
@chat_demo.connect = connect
