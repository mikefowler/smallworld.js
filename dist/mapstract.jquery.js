(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(window.jQuery || window.Zepto, window.Mapstract);
  }

}(function ($, Mapstract) {

  'use strict';

  // --------------------------------------------------------------------------
  // Register plugin with jQuery
  // --------------------------------------------------------------------------

  $.extend($.fn, {

    mapstract: function (options) {

      var opts = $.extend({}, $.fn.mapstract.defaults, options);

      return this.each(function () {

        $(this).data('mapstract', new Mapstract(this, opts));
        return this;

      });

    }

  });

  // --------------------------------------------------------------------------
  // Define default plugin options. 
  // --------------------------------------------------------------------------
  
  $.fn.mapstract.defaults = {};

}));