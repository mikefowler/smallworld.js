(function () {
  
  'use strict';
  
  function Map (options) {
    this.options = options || {};
    
    this.width = this.options.width || 300;
    this.height = this.options.height || 150;
    
    this.el = document.createElement('canvas');
    this.el.width = this.width;
    this.el.height = this.height;
    
    if (this.options.className) {
      this.el.classList.add(this.options.className);
    }
    
    this.draw();
    
  }
  
  Map.prototype.draw = function () {
    
  };

  window.Map = Map;
  
}());