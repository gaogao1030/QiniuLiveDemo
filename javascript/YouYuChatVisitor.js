var visitorAccess;visitorAccess=function(){return $(document).on("visitor:started",function(){return util.showLog("正在连接有渔直播室...")}),$(document).on("visitor:room:connected",function(){var e,n;return util.showLog("欢迎来到有渔直播室，你目前的身份是游客不可以发言"),n=base.currentClient.room,e=base.currentClient.realtime,n.join(function(){return base.getLog(n)}),n.receive(function(e){return"member"===util.parseMsgLevel(e)?util.showMsg(e):util.showSystemMsg(e)}),e.on("reuse",function(){return util.showLog("正在重新连接有渔直播聊天系统")}),e.on("error",function(){return util.showLog("好像有什么不对劲 请打开console 查看相关日志 ")}),e.on("join",function(e){return _.each(e.m,function(e){var n;return n=e.split(":")[1],n!==base.currentClient.client_id?util.showLog(n+"加入有渔直播间"):void 0})}),e.on("kicked",function(e){return console.log(e)})}),$(document).on("visitor:pressEnter",function(){return alert("你目前的身份是游客不可以发言")}),$(document).on("visitor:inputSend:click",function(){return util.elements.changeName.modal("show")}),$(document).on("visitor:confirmName:click",function(){var e;return e=util.elements.inputNickName.val(),base.currentClient.client_id=e,util.isEmptyString(e)?void 0:(base.closeRealTime(base.currentClient.realtime),util.elements.changeName.modal("hide"))})};