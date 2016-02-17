'use strict';

var ScriptLoader = (function(_this) {
  return function() {
    var loaded    = [];
    var loading   = {};
    var callbacks = {};

    var add_callback = function(url, callback) {
      if( !callback ){ return false }

      callbacks[url] ? null : callbacks[url] = [];
      callbacks[url].push( callback );
    }

    var exec_callbacks = function(url) {
      var fn, k;
      var set = callbacks[url];

      // Execute Callbacks for URL
      for (k in set) {
        fn = set[k];
        fn();
      }

      delete callbacks[url];
    }

    var add_loading = function(url, callback) {
      loading[url] = true;
      add_callback(url, callback);
    }

    var add_loaded = function(url) {
      loaded.push(url);
      delete loading[url];
    }

    var load = function( url, callback ) {
      var $this = this;

      if ( loaded.indexOf(url) !== -1 ) {
        add_callback(url, callback);
        exec_callbacks(url);
        return false;
      }

      if ( loading[url] ) {
        add_callback(url, callback);
        return false;
      }

      add_loading(url, callback);

      var script = document.createElement("script");

      script.type    = "text/javascript";
      script.charset = "utf-8";
      script.defer   = true;

      if (script.readyState) {
        //IE
        script.onreadystatechange = function() {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;

            add_loaded(url);
            exec_callbacks(url);
          }
        };
      } else {
        //Others
        script.onload = function() {
          add_loaded(url);
          exec_callbacks(url);
        };
      }

      script.src = url;
      document.getElementsByTagName("head")[0].appendChild(script);
    }

    return { load: load, loaded: loaded };
  }
})(this)();

window.ScriptLoader = ScriptLoader;
