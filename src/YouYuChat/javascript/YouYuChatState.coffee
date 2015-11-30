Config = require './YouYuChatConfig'
module.exports = ->
  YouYuChatState = {
    appid: Config.appid
    appkey: Config.appkey
    msgTime: undefined
    logFlag: false
    log: []
    room_name:"YouYuLive"
    room: undefined
    client_id:"游客"
    #client_id:"gaogao"
    realtime: undefined
    conv_id: undefined
    members: []
    notalk: false
    white_list: {}
    white_list_open: true
    online_members: []
    live_stream: "rtmp://pili-live-rtmp.live.youyu.im/cimu/test"
  }
