(function() {
  var methods = ['get', 'put', 'post', 'delete'],
      actions = ['index', 'show', 'new', 'create', 'edit', 'update', 'destroy'];

  function parseUrl(url) {
    var urlParts = url.match(/^((http[s]?|ftp):\/\/)?(((.+)@)?([^:\/\?#\s]+)(:(\d+))?)?(\/?[^\?#\.]+)?(\.([^\?#]+))?(\?([^#]?))?(#(.*))?$/i) || [];
    var pathParts = (urlParts[9]) ? urlParts[9].match(/(\/.*)\/+(\w+)$/i) || [] : [];
    return {scheme: urlParts[2], credentials: urlParts[5], host: urlParts[6], port: urlParts[8], path: urlParts[9], action: pathParts[2] || '', format: urlParts[11], query: urlParts[13], hash: urlParts[15]};
  }

  function observeAjax(original, url) {
    var method = (this.options.parameters['_method'] || this.options.method || 'post').toLowerCase(),
        urlParts = parseUrl(url),
        path = urlParts.path,
        action = urlParts.action,
        handled, proceeded;

    var proceed = function(options) {
      proceeded = true;
      this.proceeded = true;
      this.options = Object.extend(this.options, options || {});
      return original(url);
    }.bind(this); // TODO: remove prototype dependency

    for (var mapping in context.resources) {
      var resource = context.resources[mapping],
          actions = resource.__actions__,
          pathvars = resource.__pathvars__,
          f, matches, result, vars = {};

      if (!(matches = path.match(resource.__path__))) continue;

      var mAction = matches[matches.length - 2], mIdOrAction = matches[matches.length - 3];
      switch (method) {
        case 'get':
          if (!(f = actions['get'][action])) {
            if (!mIdOrAction) action = '';
            switch (action) {
              case '': f = actions['index']; break;
              case 'new': f = actions['new']; break;
              case 'edit': f = actions['edit']; break;
              default: f = (!mAction) ? actions['show'] : false;
            }
          }
          break;
        case 'put': f = actions['put'][action] || ((!mAction) ? actions['update'] : false); break;
        case 'post': f = actions['post'][action] || ((!mIdOrAction) ? actions['create'] : false); break;
        case 'delete': f = actions['delete'][action] || ((!mAction) ? actions['destroy'] : false); break;
      }

      if (f) {
        for (var i = 0; i < pathvars.length; i += 1) vars[pathvars[i]] = matches[i + 1];
        result = f(proceed, vars, urlParts);
      }
      if (result !== false && !proceeded) proceed(result);
      handled = true;
    }
    if (!handled) return original(url);
  }

  function currentResource(path) {
    if (this.resources[path]) return this.resources[path];
    var i, resource = this.resources[path] = {
      __path__: new RegExp('^' + (path[0] == '/' ? path : '/' + path).replace(/:\w+/ig, '(\\w+)') + '/?(\\w+)?/?(\\w+)?/?($|\\?|\\.|#)', 'i'),
      __pathvars__: (path.match(/:(\w+)/ig) || []).join('|').replace(/:/g, '').split('|'),
      __actions__: {},
      add: function(actionOrActions, callback, method) {
        var myActions = this.__actions__;
        if (typeof(actionOrActions) == 'string' && typeof(callback) == 'function') {
          var action = actionOrActions.split(':');
          if (action.length > 1) myActions[action[0]][action[1]] = callback;
          else myActions[action[0]] = callback;
        } else if (typeof(actionOrActions) == 'object') {
          for (i = 0; i < methods.length; i += 1) { myActions[methods[i]] = actionOrActions[methods[i]] || myActions[methods[i]] || {}; }
          for (i = 0; i < actions.length; i += 1) { myActions[actions[i]] = actionOrActions[actions[i]] || myActions[actions[i]]; }
        } else {
          throw('To add a resource you must provide: action or method:action, callback function - or - an object of actions/methods');
        }
        return this;
      }
    };
    for (i = 0; i < actions.length; i += 1) {
      resource[actions[i]] = (function(action) {
        return function(callback) { return resource.add(action, callback) }
      })(actions[i]);
    }
    for (i = 0; i < methods.length; i += 1) {
      resource[methods[i]] = (function(method) {
        return function(action, callback) { return resource.add(method + ':' + action, callback); }
      })(methods[i]);
    }
    return resource;
  }

  // TODO: add support for jQuery, mootools, YUI, Dojo, and ??
  Ajax.Request.prototype.request = Ajax.Request.prototype.request.wrap(observeAjax);

  // TODO: let's have a way to accomplish adding nicely to a window.Rails variable
  var context = window.Rails = {
    resources: {},
    resource: function(path, actions) {
      return currentResource.call(this, path).add(actions || {});
    }
  };
})();
