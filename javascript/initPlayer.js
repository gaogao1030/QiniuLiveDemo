$(function() {
  return videojs("really-cool-video", {
    width: 1280,
    height: 720
  }, function() {
    var tmp_width;
    window.a = this;
    this.play();
    tmp_width = this.width();
    return this.on('loadeddata', function() {
      console.log("aa");
      setTimeout((function(_this) {
        return function() {
          return _this.width(tmp_width - 1);
        };
      })(this), 500);
      return setTimeout((function(_this) {
        return function() {
          return _this.width(tmp_width);
        };
      })(this), 1000);
    });
  });
});
