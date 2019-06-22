(function() {
  var model = window.model;
  var storage = window.localStorage;
  
  Object.assign(model, {
    init: function(callback) {
      var data = storage.getItem(model.TOKEN);//处理刷新操作
      try {
        if (data) model.data = JSON.parse(data);
      }
      catch (e) {
        storage.setItem(model.TOKEN, '');
        console.error(e);
      }

      if (callback) callback();
    },
    flush: function(callback) {
      try {
        storage.setItem(model.TOKEN, JSON.stringify(model.data));//更新后的数据存本地
      }
      catch (e) {
        console.error(e);
      }
      if (callback) callback();
    }
  });
})();