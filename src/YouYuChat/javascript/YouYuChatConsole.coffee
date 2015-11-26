module.exports = ->
  YouYuChatConsole = {
    save: (data,filename) ->
      unless data
        console.error "no data"
        return
      unless filename
        filename = 'youyu_chat_console.json'

      if typeof data =="object"
        data = JSON.stringify(data,undefined,4)

      blob = new Blob([data],{type: 'text'})
      e = document.createEvent('MouseEvents')
      a = document.createElement('a')

      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json',a.download,a.href].join ':'
      e.initMouseEvent 'click',true,false,window,0,0,0,0,0,false,false,false,false,0,null
      a.dispatchEvent(e)
  }
