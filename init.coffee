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
    'broad_cast': "<p style='color:#20882f'>发言请输入分配的姓名代码。点击这里下载<a href='http://78rc6t.com1.z0.glb.clouddn.com/FVcJKqVsuPQh/documents/a4fbe4a489444eb5a1dddf8d0d7d164e.zip' target='_blank'> <u>Scratch软件</u> </a>，如直播过程中黑屏，请下载使用<a href='http://78rc6t.com1.z0.glb.clouddn.com/FVcJKqVsuPQh/documents/2c0f7504160e40c28da2371379ec20ab.zip' target='_blank'> <u>谷歌浏览器</u> </a>。</p>"
    'notice': "<div style='font-size:30px;font-weight:bold;'><p>直播尚未开始</p><p>敬请期待</p></div>"
    'live_stream': 'rtmp://pili-live-rtmp.live.youyu.im/cimu/test'
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
