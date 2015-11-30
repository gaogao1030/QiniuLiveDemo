AV=require 'leanengine'
realtime = require 'leancloud-realtime'
process = require 'process'
md5 = require 'md5'
Config = require './src/YouYuChat/javascript/YouYuChatConfig'
State = (require './src/YouYuChat/javascript/YouYuChatState')()
AV.initialize Config.appid,Config.secret
createCheatCode= ()->
  CheatCode = AV.Object.extend("CheatCode")
  cheat_code = new CheatCode
  cheat_code.save({
    'notalk': false
    'auth_code': md5('youyulive')
    'token': md5('hentai')
    'white_list': {}
    'white_list_open': true
    'broad_cast': ''
    'notice': ''
    'live_stream': ''
  },
  success: (code)->
    console.log "请将objectId:#{code.id}填入到配置文件中的cheat_code_id"
  ,
  error:(code,error)->
    console.log error
  )

createRoom = ->
  rt = realtime
    appId: Config.appid
    clientId: "#{State.room_name}:#{State.client_id}"
    secure: false
  rt.on 'open', =>
    rt.room({
      name: State.room_name
      attr: {room_id: State.room_name}
      unique: true
      members: [
        "#{State.room_name}:#{State.client_id}"
      ]
    },
    (room) =>
      console.log "#{room.name}已经被创建"
      process.exit()
    )

createRoom()
createCheatCode()
