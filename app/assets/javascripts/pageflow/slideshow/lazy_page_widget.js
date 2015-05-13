pageflow.lazyPageWidget = (function($) {
  var creatingMethods = ['reinit', 'reactivate', 'activate', 'activateAsLandingPage', 'prepare'];
  var ignoredMethods = ['cleanup', 'refreshScroller', 'resize', 'preload', 'deactivate'];

  var prototype = {
    _create: function() {
      this.configuration = this.element.data('configuration') || this.options.configuration;
    },

    _ensureCreated: function() {
      this.created = true;
      this.element.nonLazyPage(this.options);
    },

    _delegateToInner: function(method, args) {
      return this.element.nonLazyPage.apply(this.element, [method].concat([].slice.call(args)));
    },

    getConfiguration: function() {
      return this.configuration;
    },

    update: function(configuration) {
      if (this.created) {
        this._delegateToInner('update', arguments);
      }
      else {
        _.extend(this.configuration, configuration.attributes);
      }
    }
  };

  _(creatingMethods).each(function(method) {
    prototype[method] = function() {
      this._ensureCreated();
      return this._delegateToInner(method, arguments);
    };
  });

  _(ignoredMethods).each(function(method) {
    prototype[method] = function() {
      if (this.created) {
        return this._delegateToInner(method, arguments);
      }
    };
  });

  $.widget('pageflow.page', prototype);
}(jQuery));