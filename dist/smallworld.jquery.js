(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto, window.Smallworld);
  }

}(function ($, Smallworld) {

  'use strict';

  // --------------------------------------------------------------------------
  // Register plugin with jQuery
  // --------------------------------------------------------------------------

  $.extend($.fn, {

    smallworld: function (options) {

      var opts = $.extend({}, $.fn.smallworld.defaults, options);

      return this.each(function () {

        $(this).data('smallworld', new Smallworld(this, opts));
        return this;

      });

    }

  });

  // --------------------------------------------------------------------------
  // Define default plugin options. 
  // --------------------------------------------------------------------------
  
  $.fn.smallworld.defaults = {};

}));