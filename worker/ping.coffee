AV = require 'leanengine'
AV.realtime = require 'leancloud-realtime'
AV.realtime.config({WebSocket: require('websocket').w3cwebsocket})
process = require "process"
_ = require 'underscore'
realtime = undefined
events = require 'events'
emitter =  new events.EventEmitter()
room_id = "563c5ed560b25749ea09bf2c"
room = undefined
members = []
appid = "2PKFqnCxPQ8DWMK2uiRWsQpz"
secret = "Db8UOjtkzPgG1RrRHJSOPfth"
clientId ="maintentance"
current_ping_count = 0
should_ping_count = 0

emitter.on "start",->
  AV.initialize(appid,secret)
  conv = AV.Object.extend('_conversation')
  q = new AV.Query(conv)
  q.equalTo("objectId",room_id)
  q.find({
    success: (res) =>
      #console.log res[0]._serverData.m
      members = res[0]._serverData.m
      emitter.emit("members:get")
  })

getSliceCount = ->
  arr = []
  init_count = 0
  return sliceCount = (length)->
    if init_count >= length
      return arr
    else
      init_count = init_count+20
      arr.push init_count
      sliceCount(length)

getSliceMember = (members,slice_count)->
  arr = []
  init_count = 0
  _.each(slice_count,(count)->
    arr.push members.slice(init_count,count)
    init_count = count
  )
  return arr


emitter.on "members:get",->
  realtime = AV.realtime({
    appId: appid
    clientId: clientId
    encodeHTML: true
  })
  realtime.on 'open', ->
    realtime.conv(room_id,(obj)->
      if obj
        room = obj
        emitter.emit("room:get")
      else
        emitter.emit("room:unget")
    )
  realtime.on('membersleft',(data)->
    console.log data
  )

emitter.on "room:get", ->
  member_count = members.length
  sliceCount = getSliceCount()
  slice_count = sliceCount(member_count)
  should_ping_count = slice_count.length
  slice_members= getSliceMember(members,slice_count)
  _.each(slice_members,(members)->
    realtime.ping(members,(data)->
      emitter.emit('realtime:ping',members,data)
    )
  )
    #$console.log data

emitter.on "room:unget", ->
  console.log "房间获取失败"

emitter.on "realtime:ping", (members,online_members)->
  offline_members = _.filter(members,(member)->
    return member if online_members.indexOf(member) == -1
  )
  console.log "online:"
  console.log online_members
  offline_members = _.without(offline_members,'qiniuLive:游客')
  console.log "offline:"
  console.log offline_members
  #console.log room.remove
  room.remove(offline_members,->
    console.log "remove done"
    current_ping_count = current_ping_count + 1
    if should_ping_count == current_ping_count
      emitter.emit "process:done"
  )
  if offline_members.length == 0
    current_ping_count = current_ping_count + 1
    if should_ping_count == current_ping_count
      emitter.emit "process:done"

emitter.on "process:done",->
  process.exit()

emitter.emit("start")
