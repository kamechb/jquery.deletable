/*
jQuery.deletable Plugin

MIT license.

kamechb
<mailto:kamechb@gmail.com>

*/ 
(function($){

  var Deletable = function(el, options) {
    var self = this;

    this.options = $.extend({}, this.options, options);
    this.el = $(el);
    this.toggle = this.el.find(this.options.toggle);
    if(this.toggle.length == 0) this.toggle = $(this.options.toggle);

    this._attachEvent.call(this);
  };

  $.extend(Deletable.prototype, {
    options: {
      toggle:      '.operate a',  // 触发删除事件的元素
      delegateTo:  null,          // 是否采用delegate的方式, 如果是指定delegate元素的selector
      deleteItem:  null,          // 在采用delegate方式的情况下，需要指定删除元素的selector
      confirm:     '确定删除吗？',
      ajax:        true,
      url:         null,
      urlAttr:     'data-rel',    // 删除的请求地址存放在哪个属性里
      data:        {},
      method:      'delete',
      afterDelete: null           // execute context is deletable element
    },

    _attachEvent: function(){
      if(this.options['delegateTo']) {
        this._delegateEvent();
      } else {
        var self = this;
        this.toggle.click(function(event){
          event.preventDefault();
          self.triggerEvent();
        })
      }
    },
    triggerEvent: function(){
      if(this.options.confirm) {
        if(confirm(this.options.confirm)) {
          this.do_delete();
        }
      } else {
        this.do_delete();
      }
    },
    _delegateEvent: function(){
      this.delegateEle = $(this.options.delegateTo);
      var self = this;
      this.delegateEle.delegate(this.options.toggle, "click", function(e){
        e.preventDefault();
        // 将el和toggle设置到对应的元素
        self.toggle = $(e.currentTarget);
        self.el = self.toggle.closest(self.options.deleteItem);
        self.triggerEvent();
      });
    },
    do_delete: function(){
      if(this.options.ajax){
        this._ajaxDelete();
      } else {
        this._removeEl();
      }
    },

    _ajaxDelete: function(){
      var self = this;
      var url = this.options.url || this.toggle.attr(this.options.urlAttr);
      $.ajax(url, {
        data: this.options.data,
        type: this.options.method
      }).success(function(){
        self._removeEl();
      })
    },
    _removeEl: function(){
      this.el.remove();
      if(typeof this.options.afterDelete == "function"){
        this.options.afterDelete.call(this.el)
      }
    }
  });

  $.fn.deletable = function(options){
    var $delegate, data, $this;
    if(options['delegateTo']){
      $delegate = $(options['delegateTo']);
      data = $delegate.data('deletable');
      if(!data) {
        $delegate.data('deletable', (data = new Deletable(this, options)) )
      }
    } else {
      return this.each(function(){
        $this = $(this);
        data  = $this.data('deletable');
        if(!data) {
          $this.data('deletable', (data = new Deletable(this, options)) )
        }
      });
    }
    if(typeof options === 'string') {
      data[options].call(data);
    }
  };

})(jQuery)
