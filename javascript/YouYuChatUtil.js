var YouYuChatUtil;

YouYuChatUtil = {
  isVisitor: function() {
    if (base.currentClient.client_id === "游客") {
      return true;
    }
    return false;
  },
  timeoutPromise: function(promise, ms) {
    var delayPromise, timeout_promise;
    delayPromise = function() {
      return new AV.Promise(function(resolve) {
        return setTimeout(resolve, ms);
      });
    };
    timeout_promise = delayPromise(ms).then(function() {
      return Promise.reject(new Error("请求超时"));
    });
    return AV.Promise.race([promise, timeout_promise]);
  },
  formatTime: function(time) {
    var date;
    date = new Date(time);
    return $.format.date(date, "hh:mm:ss");
  },
  showLog: function(msg, data, isBefore) {
    var p, printWall;
    printWall = this.elements.printWall;
    printWall.scrollTop(printWall[0].scrollHeight);
    if (data) {
      msg = msg + '<span class="strong">' + encodeHTML(JSON.stringify(data)) + '</span>';
    }
    p = document.createElement('p');
    p.innerHTML = msg;
    if (isBefore) {
      return $(p).insertBefore(printWall.children()[0]);
    } else {
      return printWall.append(p);
    }
  },
  encodeHTML: function(source) {
    return String(source).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  },
  isEmptyString: function(string) {
    if (String(string).replace(/^\s+/, '').replace(/\s+$/, '')) {
      return false;
    }
    return true;
  }
};
