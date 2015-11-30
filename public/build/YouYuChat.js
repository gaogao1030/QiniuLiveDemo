webpackJsonp([1,0],[function(e,t,n){e.exports=n(8)},function(e,t,n){var o,r;o=n(13),r=new o,e.exports=function(){var e;return e={baseState:function(){return{set:function(e,t){return r[e]=t},get:function(e){return r[e]}}}(),createRealtime:function(e){var t;return _.isUndefined(e)||this.baseState.set("client_id",e),t=AV.realtime({appId:this.baseState.get("appid"),clientId:this.baseState.get("room_name")+":"+this.baseState.get("client_id"),secure:!1}),this.baseState.set("realtime",t),t},getConversation:function(){var e,t,n;return t=new AV.Promise,AV.initialize(this.baseState.get("appid"),this.baseState.get("appkey")),e=AV.Object.extend("_conversation"),n=new AV.Query(e),n.equalTo("attr.room_id",this.baseState.get("room_name")),n.find({success:function(e){return function(n){var o,r;return o=(null!=(r=n[0])?r.id:void 0)||"null",e.baseState.set("members",n[0].attributes.m),e.baseState.set("conv_id",o),$(document).trigger("conversation_id:Got"),t.resolve(o)}}(this),error:function(e){return function(e){return t.reject(e)}}(this)}),t},connectRoom:function(){var e,t;return e=new AV.Promise,this.createRealtime(),t=this.baseState.get("realtime"),t.on("open",function(n){return function(){return t.room(n.baseState.get("conv_id"),function(t){return n.baseState.set("room",t),$(document).trigger("room:connected"),e.resolve(t)})}}(this))},createRoom:function(e,t){var n,o;return n=new AV.Promise,this.createRealtime(t),o=this.baseState.get("realtime"),this.baseState.set("room_name",e),this.baseState.set("client_id",t),o.on("open",function(e){return function(){return o.room({name:e.baseState.get("room_name"),attr:{room_id:e.baseState.get("room_name")},members:[e.baseState.get("room_name")+":"+e.baseState.get("client_id")]},function(t){return e.baseState.set("room",t),$(document).trigger("room:created"),n.resolve(t)})}}(this))},closeRealTime:function(e){var t;return t=new AV.Promise,e.close(),e.on("close",function(){return t.resolve(),$(document).trigger("realtime:closed")}),t},getLog:function(e){var t;return t=new AV.Promise,this.baseState.set("room",e),this.baseState.get("logFlag")?void 0:(this.baseState.set("logFlag",!0),e.log({t:this.baseState.get("msgTime")},function(e){return function(n){var o;return e.baseState.set("logFlag",!1),o=n.length,o&&(e.baseState.set("msgTime",n[0].timestamp),n.reverse()),e.baseState.set("log",n),$(document).trigger("log:got"),t.resolve(n)}}(this)),t)},clearRoomMembers:function(e){return e.list(function(t){return e.remove(t,function(){return console.log("clearn room members")})})}}}},function(e,t,n){var o,r;o=n(1),r=new o,e.exports=function(){var e;return e={elements:function(){return{body:$("body"),printWall:$("#printWall"),sendMsgBtn:$("#btnSend"),inputSend:$("#chatInput"),inputNickName:$("#inputNickName"),confirmName:$("#confirmName"),changeName:$("#changeName"),chatArea:$(".chat-area"),modalDialog:$(".modal-dialog"),coverText:$(".cover-text")}},templates:function(){return{showlog:$("#showlog"),showmsg:$("#showmsg"),showsystemmsg:$("#showsystemmsg"),showmymsg:$("#showmymsg"),showinfo:$("#showinfo")}},template:function(e,t){var n;return n=e.html(),_.template(n)(t)},isVisitor:function(){var e;return e=["游客",""],-1!==_.indexOf(e,r.baseState.get("client_id"))?!0:!1},timeoutPromise:function(e,t){var n,o;return n=function(){return new AV.Promise(function(e){return setTimeout(e,t)})},o=n(t).then(function(){return Promise.reject(new Error("请求超时"))}),AV.Promise.race([e,o])},formatTime:function(e){var t;return t=new Date(e),$.format.date(t,"hh:mm:ss")},renderToPrintWall:function(e,t){var n;return n=this.elements().printWall,n.scrollTop(n[0].scrollHeight),t?$(e).insertBefore(n.children()[0]):n.append(e),this.scrollToBottomPrintWall()},showInfo:function(e){var t;return t=this.template(this.templates().showinfo,{msg:e}),this.renderToPrintWall(t)},showLog:function(e,t){var n;return n=this.template(this.templates().showlog,{msg:this.encodeHTML(e)}),this.renderToPrintWall(n,t)},encodeHTML:function(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")},isEmptyString:function(e){return""!==String(e).replace(/^\s+/,"").replace(/\s+$/,"")?!1:!0},clearInput:function(){return this.elements().inputSend.val("")},scrollToBottomPrintWall:function(){var e;return e=this.elements().printWall,e.scrollTop(e[0].scrollHeight)},showMsg:function(e,t){var n,o,r,s;return s="",n=e.fromPeerId,o=n.split(":")[1],o=this.parseClientIdToName(o),s=e.msg.type?e.msg.text:e.msg,this.isEmptyString(s)?void 0:(r=this.template(this.templates().showmsg,{msg_time:this.formatTime(e.timestamp),from_name:this.encodeHTML(o),text:this.encodeHTML(s)}),this.renderToPrintWall(r,t))},showMyMsg:function(e,t,n){var o;return o=this.template(this.templates().showmymsg,{msg_time:this.formatTime(e.t),from_name:this.parseClientIdToName(r.baseState.get("client_id")),text:this.encodeHTML(t)}),this.renderToPrintWall(o,n)},showBroadCast:function(e,t){return this.renderToPrintWall(e.msg.text,t)},showSystemMsg:function(e,t){var n,o;return o=e.msg.type?e.msg.text:e.msg,n=this.template(this.templates().showsystemmsg,{text:o}),this.renderToPrintWall(n,t)},showChatLog:function(){var e,t;return e=r.baseState.get("log"),t=this.elements().printWall,_.each(e,function(e){return function(t){return"member"===e.parseMsgLevel(t)?e.showMsg(t,!0):e.showSystemMsg(t,!0)}}(this))},parseClientIdToName:function(e){var t,n,o;return o=r.baseState.get("white_list_open"),n=r.baseState.get("white_list"),o?(t=n[e],_.isUndefined(t)?e:t):e},refreshPage:function(e){return e.msg.attr.reload?window.location.reload():e.msg.attr.userReload===r.baseState.get("client_id")?window.location.reload():void 0},parseMsgLevel:function(e){return e.msg.attr.msgLevel},getKeyByValue:function(e,t){var n;return n=_.map(e,function(e,n){return e===t?n:void 0}),_.compact(n)[0]},inWhiteList:function(e){return _.has(r.baseState.get("white_list"),e)},getSliceCount:function(){var e,t,n;return n=[],e=0,t=function(o){return e>=o?n:(e+=20,n.push(e),t(o))}},getSliceMember:function(e,t){var n,o;return o=[],n=0,_.each(t,function(t){return o.push(e.slice(n,t)),n=t}),o},fetchOnlineUser:function(){var e,t,n;return t=new AV.Promise,e=AV.Object.extend("_conversation"),n=new AV.Query(e),n.equalTo("attr.room_id",r.baseState.get("room_name")),n.find({success:function(e){return function(n){var o,s,i,a,c,u,l,d,m,f,g;return o=(null!=(l=n[0])?l.id:void 0)||"null",r.baseState.set("members",n[0].attributes.m),u=r.baseState.get("realtime"),a=r.baseState.get("members"),i=a.length,c=[],m=e.getSliceCount(),f=m(i),d=f.length,s=0,g=e.getSliceMember(a,f),_.each(g,function(e){return u.ping(e,function(e){return s+=1,c.push(e),s===d?(c=_.flatten(c),r.baseState.set("online_members",c),t.resolve(r.baseState.get("online_members")),$(document).trigger("fetchOnlineUser:done")):void 0})})}}(this),error:function(e){return function(e){}}(this)}),t}}}},function(e,t,n){var o,r,s,i,a,c,u,l;r=n(1),i=n(2),o=n(6),c=n(7),u=new i,a=new r,s=n(9),l=new s,e.exports=function(){var e;return e={getCheatCode:function(){var e,t;return e=AV.Object.extend("CheatCode"),t=new AV.Query(e),t.equalTo("objectId",o.cheat_code_id),t.find({success:function(e){return function(e){return a.baseState.set("notalk",e[0].attributes.notalk),a.baseState.set("auth_code",e[0].attributes.auth_code),a.baseState.set("cheat_code_token",e[0].attributes.token),a.baseState.set("white_list",e[0].attributes.white_list),a.baseState.set("white_list_open",e[0].attributes.white_list_open),a.baseState.set("broad_cast",e[0].attributes.broad_cast),a.baseState.set("notice",e[0].attributes.notice),a.baseState.set("live_stream",e[0].attributes.live_stream)}}(this)})},setCheatCode:function(e,t,n){var r,s,i;if(n||(n=""),c(n)!==a.baseState.get("cheat_code_token"))return console.log("permit denied");switch(r=AV.Object.createWithoutData("CheatCode",o.cheat_code_id),e){case"shutup":return a.baseState.set("notalk",!1),r.set("notalk",t),s=t?"管理员开启了全员禁言":"管理员关闭了全员禁言",r.save({success:function(){return a.baseState.get("room").send({text:s,attr:{msgLevel:"system"}},{type:"text"},function(e){return u.clearInput(),e.msg=s,u.showSystemMsg(e)})}});case"changeAuthCode":return r.set("auth_code",c(t)),s="授权码被改变页面将会被重新载入",r.save({success:function(){return a.baseState.get("room").send({text:s,attr:{msgLevel:"system",reload:!0}},{type:"text"},function(e){return u.refreshPage({msg:{attr:{reload:!0}}}),u.clearInput(),e.msg=s,u.showSystemMsg(e)})}});case"changeToken":return r.set("token",c(t)),s="Token被改变页面即将重新载入",r.save({success:function(){return a.baseState.get("room").send({text:s,attr:{msgLevel:"system",reload:!0}},{type:"text"},function(e){return u.refreshPage({msg:{attr:{reload:!0}}}),u.clearInput(),e.msg=s,u.showSystemMsg(e)})}});case"changeNoTalk":return a.baseState.set("notalk",t);case"whiteListGet":return t.save_as_file?l.save(a.baseState.get("white_list"),"whiteList.json"):a.baseState.get("white_list");case"whiteListSet":return r.set("white_list",t),s="白名单被重置",r.save({success:function(){return a.baseState.get("room").send({text:s,attr:{msgLevel:"system",reload:!0}},{type:"text"},function(e){return u.refreshPage({msg:{attr:{reload:!0}}})})}});case"whiteListAdd":return i=a.baseState.get("white_list"),i=_.extend(i,t),r.set("white_list",i),r.save({success:function(){return console.log(i),a.baseState.set("white_list",i)}});case"whiteListRemove":return this.getCheatCode().then(function(){var e;return i=a.baseState.get("white_list"),e=u.getKeyByValue(i,t),delete i[e],r.set("white_list",i),r.save({success:function(){var n;return s="白名单里删除了"+t,a.baseState.set("white_list",i),n=a.baseState.get("room_name"),a.baseState.get("room").remove(n+":"+e),a.baseState.get("room").send({text:s,attr:{msgLevel:"system",userReload:e}},{type:"text"},function(e){})}})});case"whiteListOpen":return r.set("white_list_open",t),s=t?"开启白名单功能":"关闭白名单功能",r.save({success:function(){return a.baseState.get("room").send({text:s,attr:{msgLevel:"system",reload:!0}},{type:"text"},function(e){return u.refreshPage({msg:{attr:{reload:!0}}})})}});case"broadCastSet":return r.set("broad_cast",t),a.baseState.set("broad_cast",t),r.save({success:function(){return console.log("广播更改完成")}});case"broadCastPush":return s=a.baseState.get("broad_cast"),u.showBroadCast({msg:{text:s}}),a.baseState.get("room").send({text:s,attr:{msgLevel:"broad_cast"}},{type:"text","transient":!0},function(e){});case"noticeSet":return r.set("notice",t),a.baseState.set("notice",t),r.save({success:function(){return console.log("通知更改完成")}});case"getOnlineUser":return u.fetchOnlineUser().then(function(e){return console.log(e)});case"getOnlineUserCount":return u.fetchOnlineUser().then(function(e){return e=_.without(e,a.baseState.get("room_name")+":游客"),console.log(e.length)});case"setLiveStream":return r.set("live_stream",t),a.baseState.set("live_stream",t),r.save({success:function(){return console.log("直播流已设置")}});default:return console.log("no command")}}}}},function(e,t,n){t=e.exports=n(17)(),t.push([e.id,'body{background-color:#000}.live-area{width:80%;left:0;position:absolute;height:100%}.live-area.remove{width:0}.chat-area{width:20%;position:absolute;right:0;height:100%;background-color:#fff}.chat-area.full{width:100%;z-index:100}.video-container{position:relative}#printWall{position:absolute;overflow:auto;padding:20px;border:1px solid #c2c2c2;height:90%;width:100%;text-align:left;bottom:100px}#really-cool-video{display:inline-block;width:60%}.input-group{position:absolute;bottom:0;height:10%}span.red{color:red}span.blue{color:blue}span.green{color:green}span.info{color:#31708f}.video-js .vjs-big-play-button{position:relative;margin:0 auto;top:50%}.vjs-progress-timepoint{position:absolute;top:0;bottom:0;width:6px;margin-left:-3px;border-radius:3px;background-color:#fff;cursor:pointer}.vjs-progress-tooltip{display:none;position:absolute;bottom:100%;max-width:150px;padding:.3em 1em;margin-bottom:15px;background-color:#000;color:#fff}.vjs-progress-tooltip:after{content:" ";position:absolute;top:100%;left:50%;margin-left:-10px;width:0;height:0;font:0/0 a;border:10px solid transparent;border-top-color:#000;border-bottom-width:0}.vjs-progress-tooltip span{margin-left:1em}.cover{background-image:url(http://7xl9ad.com1.z0.glb.clouddn.com/background/2.jpg);background-size:cover;background-repeat:no-repeat;z-index:1}.cover,.cover .cover-mark{width:100%;height:100%;position:absolute}.cover .cover-mark{background-color:#000;opacity:.3;z-index:2}.cover .cover-text{z-index:3;position:relative;display:inline-block;text-align:center;color:#fff}.cover .cover-text.cover-rendered{position:absolute;top:0;left:0;right:0;bottom:0;margin:auto}#chatInput{height:100px}',""])},function(e,t){var n={utf8:{stringToBytes:function(e){return n.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(n.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],n=0;n<e.length;n++)t.push(255&e.charCodeAt(n));return t},bytesToString:function(e){for(var t=[],n=0;n<e.length;n++)t.push(String.fromCharCode(e[n]));return t.join("")}}};e.exports=n},function(e,t){e.exports=function(){var e;return e={appid:"hekj5ea51b0k4o993qw30inb2h2vbct0qkopr1e006xvbbny",appkey:"uwk4yxmcb106xheksklefuu2maj0hx6i3mbtu0oc0nbmk25a",cheat_code_id:"565c1e7f00b0023c05f80f99"}}()},function(e,t,n){!function(){var t=n(16),o=n(5).utf8,r=n(18),s=n(5).bin,i=function(e,n){e.constructor==String?e=n&&"binary"===n.encoding?s.stringToBytes(e):o.stringToBytes(e):r(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||(e=e.toString());for(var a=t.bytesToWords(e),c=8*e.length,u=1732584193,l=-271733879,d=-1732584194,m=271733878,f=0;f<a.length;f++)a[f]=16711935&(a[f]<<8|a[f]>>>24)|4278255360&(a[f]<<24|a[f]>>>8);a[c>>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;for(var g=i._ff,h=i._gg,p=i._hh,v=i._ii,f=0;f<a.length;f+=16){var b=u,w=l,S=d,_=m;u=g(u,l,d,m,a[f+0],7,-680876936),m=g(m,u,l,d,a[f+1],12,-389564586),d=g(d,m,u,l,a[f+2],17,606105819),l=g(l,d,m,u,a[f+3],22,-1044525330),u=g(u,l,d,m,a[f+4],7,-176418897),m=g(m,u,l,d,a[f+5],12,1200080426),d=g(d,m,u,l,a[f+6],17,-1473231341),l=g(l,d,m,u,a[f+7],22,-45705983),u=g(u,l,d,m,a[f+8],7,1770035416),m=g(m,u,l,d,a[f+9],12,-1958414417),d=g(d,m,u,l,a[f+10],17,-42063),l=g(l,d,m,u,a[f+11],22,-1990404162),u=g(u,l,d,m,a[f+12],7,1804603682),m=g(m,u,l,d,a[f+13],12,-40341101),d=g(d,m,u,l,a[f+14],17,-1502002290),l=g(l,d,m,u,a[f+15],22,1236535329),u=h(u,l,d,m,a[f+1],5,-165796510),m=h(m,u,l,d,a[f+6],9,-1069501632),d=h(d,m,u,l,a[f+11],14,643717713),l=h(l,d,m,u,a[f+0],20,-373897302),u=h(u,l,d,m,a[f+5],5,-701558691),m=h(m,u,l,d,a[f+10],9,38016083),d=h(d,m,u,l,a[f+15],14,-660478335),l=h(l,d,m,u,a[f+4],20,-405537848),u=h(u,l,d,m,a[f+9],5,568446438),m=h(m,u,l,d,a[f+14],9,-1019803690),d=h(d,m,u,l,a[f+3],14,-187363961),l=h(l,d,m,u,a[f+8],20,1163531501),u=h(u,l,d,m,a[f+13],5,-1444681467),m=h(m,u,l,d,a[f+2],9,-51403784),d=h(d,m,u,l,a[f+7],14,1735328473),l=h(l,d,m,u,a[f+12],20,-1926607734),u=p(u,l,d,m,a[f+5],4,-378558),m=p(m,u,l,d,a[f+8],11,-2022574463),d=p(d,m,u,l,a[f+11],16,1839030562),l=p(l,d,m,u,a[f+14],23,-35309556),u=p(u,l,d,m,a[f+1],4,-1530992060),m=p(m,u,l,d,a[f+4],11,1272893353),d=p(d,m,u,l,a[f+7],16,-155497632),l=p(l,d,m,u,a[f+10],23,-1094730640),u=p(u,l,d,m,a[f+13],4,681279174),m=p(m,u,l,d,a[f+0],11,-358537222),d=p(d,m,u,l,a[f+3],16,-722521979),l=p(l,d,m,u,a[f+6],23,76029189),u=p(u,l,d,m,a[f+9],4,-640364487),m=p(m,u,l,d,a[f+12],11,-421815835),d=p(d,m,u,l,a[f+15],16,530742520),l=p(l,d,m,u,a[f+2],23,-995338651),u=v(u,l,d,m,a[f+0],6,-198630844),m=v(m,u,l,d,a[f+7],10,1126891415),d=v(d,m,u,l,a[f+14],15,-1416354905),l=v(l,d,m,u,a[f+5],21,-57434055),u=v(u,l,d,m,a[f+12],6,1700485571),m=v(m,u,l,d,a[f+3],10,-1894986606),d=v(d,m,u,l,a[f+10],15,-1051523),l=v(l,d,m,u,a[f+1],21,-2054922799),u=v(u,l,d,m,a[f+8],6,1873313359),m=v(m,u,l,d,a[f+15],10,-30611744),d=v(d,m,u,l,a[f+6],15,-1560198380),l=v(l,d,m,u,a[f+13],21,1309151649),u=v(u,l,d,m,a[f+4],6,-145523070),m=v(m,u,l,d,a[f+11],10,-1120210379),d=v(d,m,u,l,a[f+2],15,718787259),l=v(l,d,m,u,a[f+9],21,-343485551),u=u+b>>>0,l=l+w>>>0,d=d+S>>>0,m=m+_>>>0}return t.endian([u,l,d,m])};i._ff=function(e,t,n,o,r,s,i){var a=e+(t&n|~t&o)+(r>>>0)+i;return(a<<s|a>>>32-s)+t},i._gg=function(e,t,n,o,r,s,i){var a=e+(t&o|n&~o)+(r>>>0)+i;return(a<<s|a>>>32-s)+t},i._hh=function(e,t,n,o,r,s,i){var a=e+(t^n^o)+(r>>>0)+i;return(a<<s|a>>>32-s)+t},i._ii=function(e,t,n,o,r,s,i){var a=e+(n^(t|~o))+(r>>>0)+i;return(a<<s|a>>>32-s)+t},i._blocksize=16,i._digestsize=16,e.exports=function(e,n){if("undefined"!=typeof e){var o=t.wordsToBytes(i(e,n));return n&&n.asBytes?o:n&&n.asString?s.bytesToString(o):t.bytesToHex(o)}}}()},function(e,t,n){n(20),n(11)},function(e,t){e.exports=function(){var e;return e={save:function(e,t){var n,o,r;return e?(t||(t="youyu_chat_console.json"),"object"==typeof e&&(e=JSON.stringify(e,void 0,4)),o=new Blob([e],{type:"text"}),r=document.createEvent("MouseEvents"),n=document.createElement("a"),n.download=t,n.href=window.URL.createObjectURL(o),n.dataset.downloadurl=["text/json",n.download,n.href].join(":"),r.initMouseEvent("click",!0,!1,window,0,0,0,0,0,!1,!1,!1,!1,0,null),n.dispatchEvent(r)):void console.error("no data")}}}},function(e,t,n){var o,r,s,i;o=n(3),r=n(2),s=new o,i=new r,e.exports=function(){return window.talklocal=function(e){return s.setCheatCode("changeNoTalk",!1,e)},window.talkon=function(e){return s.setCheatCode("shutup",!1,e)},window.talkoff=function(e){return s.setCheatCode("shutup",!0,e)},window.tokenchange=function(e,t){return s.setCheatCode("changeToken",t,e)},window.authcode=function(e,t){return s.setCheatCode("changeAuthCode",t,e)},window.listget=function(e,t){return t||(t=!1),s.setCheatCode("whiteListGet",{save_as_file:t},e)},window.listset=function(e,t){return s.setCheatCode("whiteListSet",t,e)},window.listpush=function(e,t){return s.setCheatCode("whiteListAdd",t,e)},window.listpop=function(e,t){return s.setCheatCode("whiteListRemove",t,e)},window.liston=function(e){return s.setCheatCode("whiteListOpen",!0,e)},window.listoff=function(e){return s.setCheatCode("whiteListOpen",!1,e)},window.castset=function(e,t){return s.setCheatCode("broadCastSet",t,e)},window.castpush=function(e,t){return s.setCheatCode("broadCastPush","",e)},window.onlineuser=function(e){return s.setCheatCode("getOnlineUser","",e)},window.onlineusercount=function(e){return s.setCheatCode("getOnlineUserCount","",e)},window.noticeset=function(e,t){return s.setCheatCode("noticeSet",t,e)},window.setstream=function(e,t){return s.setCheatCode("setLiveStream",t,e)},window.screentoggle=function(){var e,t;return t=$(".live-area"),e=$(".chat-area"),t.toggleClass("remove"),e.toggleClass("full")}}()},function(e,t,n){var o,r,s,i,a,c,u,l,d,m,f;o=n(1),i=n(2),r=n(3),s=n(12),n(10),f=n(15),d=n(14),u=n(7),a=new o,m=new i,c=new r,l=new s,e.exports=function(){var e;return e=function(){return m.elements().chatArea.on("keydown",function(e){return 13===e.keyCode?$(document).trigger("pressEnter"):void 0}),m.elements().modalDialog.on("keydown",function(e){return 13===e.keyCode?$(document).trigger("visitor:confirmName:click"):void 0}),m.elements().sendMsgBtn.on("click",function(e){return $(document).trigger("sendMsgBtn:click")}),m.elements().inputSend.on("click",function(e){return $(document).trigger("inputSend:click")}),m.elements().confirmName.on("click",function(e){return $(document).trigger("confirmName:click")})},$(document).on("started",function(){return a.getConversation(),console.log("started"),m.isVisitor()?(e(),$(document).trigger("visitor:started")):$(document).trigger("user:started"),c.getCheatCode().then(function(){var e,t,n,o;l.init(),e=m.elements().coverText,e.html(a.baseState.get("notice")),n=e.height(),o=e.width(),e.addClass("cover-rendered"),e.css({height:n,width:o}),t=window.location.hash,u(t.slice("1"))!==a.baseState.get("auth_code")&&(window.location.href="/forbidden")})}),$(document).on("conversation_id:Got",function(){return console.log("conversation_id got"),a.connectRoom(),a.currentClient.realtime.on("error",function(){return console.log("error")})}),$(document).on("room:connected",function(){return console.log("room connected"),m.isVisitor()?$(document).trigger("visitor:room:connected"):$(document).trigger("user:room:connected")}),$(document).on("room:created",function(){return console.log("room created")}),$(document).on("realtime:closed",function(){return console.log("realtime closed"),m.isVisitor()?$(document).trigger("user:realtime:closed"):$(document).trigger("visitor:realtime:closed")}),$(document).on("log:got",function(){return m.showChatLog(),m.fetchOnlineUser().then(function(e){return e=_.without(e,a.baseState.get("room_name")+":游客"),m.showSystemMsg({msg:"当前登录用户有"+e.length+"人"})}),console.log("log got")}),$(document).on("pressEnter",function(){return console.log("press enter"),m.isVisitor()?$(document).trigger("visitor:pressEnter"):$(document).trigger("user:pressEnter")}),$(document).on("sendMsgBtn:click",function(){return console.log("click sendMsgBtn"),$(document).trigger("pressEnter")}),$(document).on("inputSend:click",function(){return console.log("click inputSend"),m.isVisitor()?$(document).trigger("visitor:inputSend:click"):void 0}),$(document).on("confirmName:click",function(){return console.log("click conrfirmName"),m.isVisitor()?$(document).trigger("visitor:confirmName:click"):void 0}),$(document).on("fetchOnlineUser:done",function(){var e,t,n,o;return console.log("fetchOnlineUser done"),n=a.baseState.get("online_members"),e=a.baseState.get("members"),o=a.baseState.get("room"),t=_.filter(e,function(e){return-1===n.indexOf(e)?e:void 0}),n=_.without(n,a.baseState.get("room_name")+":游客"),console.log(t),o.remove(t,function(){return console.log("remove done")})}),f(),d()}()},function(e,t,n){var o,r;o=n(1),r=new o,e.exports=function(){var e;return e={state:{inited:!1},init:function(){var e,t,n;return this.state.inited?void 0:(n=$("<video />",{"class":"video-js vjs-default-skin"}).attr({controls:!0}).css({width:"100%",height:"100%"}),n.append($("<source />",{src:r.baseState.get("live_stream"),type:"rtmp/mp4"})),e=$("#player"),e.append(n),t=videojs(n.get(0),{width:500,height:500},function(){var e,t;return this.play(),e=$(".live-area"),t=e.width(),this.on("loadeddata",function(){return $(".cover").remove(),e.css({width:"79%"}),setTimeout(function(t){return function(){return e.css({width:"80%"})}}(this),100)})}),this.state.inited=!0,t)}}}},function(e,t,n){var o;o=n(6),e.exports=function(){var e;return e={appid:o.appid,appkey:o.appkey,msgTime:void 0,logFlag:!1,log:[],room_name:"YouYuLive",room:void 0,client_id:"游客",realtime:void 0,conv_id:void 0,members:[],notalk:!1,white_list:{},white_list_open:!0,online_members:[],live_stream:"rtmp://pili-live-rtmp.live.youyu.im/cimu/test"}}},function(e,t,n){var o,r,s,i;r=n(2),o=n(1),i=new r,s=new o,e.exports=function(){return $(document).on("user:started",function(){return i.elements().sendMsgBtn.attr("disabled",!1),console.log("user:started")}),$(document).on("user:room:connected",function(){var e,t;return t=s.baseState.get("room"),e=s.baseState.get("realtime"),t.join(function(){return i.showInfo("你的昵称为<span class='green'>"+i.parseClientIdToName(s.baseState.get("client_id"))+"</span>,已经可以发言了"),i.fetchOnlineUser().then(function(e){return e=_.without(e,s.baseState.get("room_name")+":游客"),i.showSystemMsg({msg:"当前登录用户有"+e.length+"人"})})}),t.receive(function(e){return i.refreshPage(e),"member"===i.parseMsgLevel(e)?i.showMsg(e):"broad_cast"===i.parseMsgLevel(e)?i.showBroadCast(e):i.getCheatCode().then(function(){return i.showSystemMsg(e)})}),e.on("reuse",function(){return i.showInfo("正在重新连接有渔直播聊天系统")}),e.on("error",function(){return i.showInfo("好像有什么不对劲 请打开console 查看相关日志 ")}),e.on("kicked",function(e){return console.log(e),i.showSystemMsg({msg:"你已经被踢出该房间"}),i.refreshPage({msg:{attr:{reload:!0}}})}),e.on("membersleft",function(e){return _.each(e.m,function(e){var t;return t=e.split(":")[1],console.log(i.parseClientIdToName(t)+"离开了房间")})}),e.on("join",function(e){return _.each(e.m,function(e){var t;return t=e.split(":")[1],t!==s.baseState.get("client_id")&&"游客"!==t?(t=i.parseClientIdToName(t),i.showInfo(t+"加入有渔直播间"),i.fetchOnlineUser().then(function(e){return e=_.without(e,s.baseState.get("room_name")+":游客"),i.showSystemMsg({msg:"当前登录用户有"+e.length+"人"})})):void 0})})}),$(document).on("user:pressEnter",function(){var e,t;if(e=i.elements().inputSend.val(),t=s.baseState.get("room"),s.baseState.get("notalk"))alert("目前是禁止发言状态");else{if(!i.isEmptyString(e))return t.send({text:e,attr:{msgLevel:"member"}},{type:"text"},function(t){return i.clearInput(),i.showMyMsg(t,e)});alert("请输入点文字")}}),$(document).on("user:inputSend:click",function(){}),$(document).on("visitor:realtime:closed",function(){return console.log("vistor realtime closed"),$(document).trigger("started")})}},function(e,t,n){var o,r,s,i,a,c;s=n(2),o=n(1),r=n(3),c=new s,i=new o,a=new r,e.exports=function(){return $(document).on("visitor:started",function(){return c.showInfo("正在连接有渔直播室...")}),$(document).on("visitor:room:connected",function(){var e,t;return c.showInfo("欢迎来到有渔直播课堂，您可通过下方聊天框与直播老师互动。"),c.showBroadCast({msg:{text:i.baseState.get("broad_cast")}}),t=i.baseState.get("room"),e=i.baseState.get("realtime"),t.join(function(){return i.getLog(t)}),t.receive(function(e){return c.refreshPage(e),"member"===c.parseMsgLevel(e)?c.showMsg(e):"broad_cast"===c.parseMsgLevel(e)?c.showBroadCast(e):c.showSystemMsg(e)}),e.on("reuse",function(){return c.showInfo("正在重新连接有渔直播聊天系统")}),e.on("error",function(){return c.showInfo("好像有什么不对劲 请打开console 查看相关日志 ")}),e.on("join",function(e){return _.each(e.m,function(e){var t;return t=e.split(":")[1],t!==i.baseState.get("client_id")?(t=c.parseClientIdToName(t),c.showInfo(t+"加入有渔直播间"),c.fetchOnlineUser().then(function(e){return e=_.without(e,i.baseState.get("room_name")+":游客"),c.showSystemMsg({msg:"当前登录用户有"+e.length+"人"})})):void 0})}),e.on("kicked",function(e){return console.log(e),c.showSystemMsg({msg:"你已经被踢出该房间"})}),e.on("membersleft",function(e){return _.each(e.m,function(e){var t;return t=e.split(":")[1],console.log(c.parseClientIdToName(t)+"离开了房间")})})}),$(document).on("visitor:pressEnter",function(){return alert("你目前还未输入姓名，不可以发言")}),$(document).on("visitor:inputSend:click",function(){return c.elements().changeName.modal("show")}),$(document).on("visitor:confirmName:click",function(){var e;return e=c.elements().inputNickName.val(),a.getCheatCode().then(function(){return c.inWhiteList(e)||!i.baseState.get("white_list_open")?(i.baseState.set("client_id",e),c.isEmptyString(e)?alert("昵称不能为空"):(i.closeRealTime(i.baseState.get("realtime")),c.elements().changeName.modal("hide"))):alert("你输入的昵称不在白名单中")})})}},function(e,t){!function(){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&n.rotl(e,8)|4278255360&n.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=n.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],n=0,o=0;n<e.length;n++,o+=8)t[o>>>5]|=e[n]<<24-o%32;return t},wordsToBytes:function(e){for(var t=[],n=0;n<32*e.length;n+=8)t.push(e[n>>>5]>>>24-n%32&255);return t},bytesToHex:function(e){for(var t=[],n=0;n<e.length;n++)t.push((e[n]>>>4).toString(16)),t.push((15&e[n]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],n=0;n<e.length;n+=2)t.push(parseInt(e.substr(n,2),16));return t},bytesToBase64:function(e){for(var n=[],o=0;o<e.length;o+=3)for(var r=e[o]<<16|e[o+1]<<8|e[o+2],s=0;4>s;s++)8*o+6*s<=8*e.length?n.push(t.charAt(r>>>6*(3-s)&63)):n.push("=");return n.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var n=[],o=0,r=0;o<e.length;r=++o%4)0!=r&&n.push((t.indexOf(e.charAt(o-1))&Math.pow(2,-2*r+8)-1)<<2*r|t.indexOf(e.charAt(o))>>>6-2*r);return n}};e.exports=n}()},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var s=this[r][0];"number"==typeof s&&(o[s]=!0)}for(r=0;r<t.length;r++){var i=t[r];"number"==typeof i[0]&&o[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),e.push(i))}},e}},function(e,t){e.exports=function(e){return!(null==e||!e.constructor||"function"!=typeof e.constructor.isBuffer||!e.constructor.isBuffer(e))}},function(e,t,n){function o(e,t){for(var n=0;n<e.length;n++){var o=e[n],r=f[o.id];if(r){r.refs++;for(var s=0;s<r.parts.length;s++)r.parts[s](o.parts[s]);for(;s<o.parts.length;s++)r.parts.push(u(o.parts[s],t))}else{for(var i=[],s=0;s<o.parts.length;s++)i.push(u(o.parts[s],t));f[o.id]={id:o.id,refs:1,parts:i}}}}function r(e){for(var t=[],n={},o=0;o<e.length;o++){var r=e[o],s=r[0],i=r[1],a=r[2],c=r[3],u={css:i,media:a,sourceMap:c};n[s]?n[s].parts.push(u):t.push(n[s]={id:s,parts:[u]})}return t}function s(e,t){var n=p(),o=w[w.length-1];if("top"===e.insertAt)o?o.nextSibling?n.insertBefore(t,o.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),w.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function i(e){e.parentNode.removeChild(e);var t=w.indexOf(e);t>=0&&w.splice(t,1)}function a(e){var t=document.createElement("style");return t.type="text/css",s(e,t),t}function c(e){var t=document.createElement("link");return t.rel="stylesheet",s(e,t),t}function u(e,t){var n,o,r;if(t.singleton){var s=b++;n=v||(v=a(t)),o=l.bind(null,n,s,!1),r=l.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(t),o=m.bind(null,n),r=function(){i(n),n.href&&URL.revokeObjectURL(n.href)}):(n=a(t),o=d.bind(null,n),r=function(){i(n)});return o(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;o(e=t)}else r()}}function l(e,t,n,o){var r=n?"":o.css;if(e.styleSheet)e.styleSheet.cssText=S(t,r);else{var s=document.createTextNode(r),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(s,i[t]):e.appendChild(s)}}function d(e,t){var n=t.css,o=t.media;t.sourceMap;if(o&&e.setAttribute("media",o),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function m(e,t){var n=t.css,o=(t.media,t.sourceMap);o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var r=new Blob([n],{type:"text/css"}),s=e.href;e.href=URL.createObjectURL(r),s&&URL.revokeObjectURL(s)}var f={},g=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},h=g(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),p=g(function(){return document.head||document.getElementsByTagName("head")[0]}),v=null,b=0,w=[];e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=h()),"undefined"==typeof t.insertAt&&(t.insertAt="bottom");var n=r(e);return o(n,t),function(e){for(var s=[],i=0;i<n.length;i++){var a=n[i],c=f[a.id];c.refs--,s.push(c)}if(e){var u=r(e);o(u,t)}for(var i=0;i<s.length;i++){var c=s[i];if(0===c.refs){for(var l=0;l<c.parts.length;l++)c.parts[l]();delete f[c.id]}}}};var S=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},function(e,t,n){var o=n(4);"string"==typeof o&&(o=[[e.id,o,""]]);var r=n(19)(o,{});o.locals&&(e.exports=o.locals),o.locals||e.hot.accept(4,function(){var t=n(4);"string"==typeof t&&(t=[[e.id,t,""]]),r(t)}),e.hot.dispose(function(){r()})}]);
//# sourceMappingURL=YouYuChat.js.map