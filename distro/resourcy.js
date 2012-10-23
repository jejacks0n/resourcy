
/*!
Resourcy v1.1.0

Resourcy is an unobtrusive RESTful adapter for jquery-ujs and Rails.

Documentation and other useful information can be found at
https://github.com/jejacks0n/resourcy

Copyright (c) 2012 Jeremy Jackson

https://raw.github.com/jejacks0n/resourcy/master/LICENSE
*/


(function() {
  var actions, addCallback, createResource, descriptions, determineCallback, handleRequest, methods, parseUrl, resources, _ref,
    _this = this;

  resources = {};

  methods = ['get', 'put', 'post', 'delete'];

  actions = ['index', 'create', 'new', 'edit', 'show', 'update', 'delete'];

  descriptions = {
    plural: [['get', ''], ['post', ''], ['get', '/new'], ['get', '/:id/edit'], ['get', '/:id'], ['put', '/:id'], ['delete', '/:id']],
    singular: [null, ['post', ''], ['get', '/new'], ['get', '/edit'], ['get', ''], ['put', ''], ['delete', '']]
  };

  parseUrl = function(url) {
    var path, _ref;
    url = url.match(/^((http[s]?|ftp):\/\/)?(((.+)@)?([^:\/\?#\s]+)(:(\d+))?)?(\/?[^\?#\.]+)?(\.([^\?#]+))?(\?([^#]*))?(#(.*))?$/i) || [];
    path = ((_ref = url[9]) != null ? _ref.match(/(\/.*)\/+(\w+)$/i) : void 0) || [];
    return {
      scheme: url[2],
      credentials: url[5],
      host: url[6],
      port: url[8],
      path: url[9],
      action: path[2] || '',
      format: url[11],
      query: url[13],
      hash: url[15]
    };
  };

  createResource = function(path, singular, defaults) {
    if (singular == null) {
      singular = false;
    }
    if (defaults == null) {
      defaults = {};
    }
    if (resources[path]) {
      return resources[path];
    }
    return resources[path] = {
      path: new RegExp("^" + ((path[0] === '/' ? path : "/" + path).replace(/:\w+/ig, '(\\w+)')) + "/?(\\w+)?/?(\\w+)?/?($|\\?|\\.|#)", 'i'),
      pathvars: (path.match(/:(\w+)/ig) || []).join('|').replace(/:/g, '').split('|'),
      actions: {},
      defaults: defaults,
      singular: singular,
      name: path.substr(path.lastIndexOf('/') + 1),
      options: function(defaults) {
        if (defaults == null) {
          defaults = {};
        }
        this.defaults = defaults;
        return this;
      },
      add: function(action, callback) {
        var method, object, _ref;
        object = {};
        if (typeof action === 'string') {
          object[action] = callback;
        } else {
          object = action;
        }
        for (action in object) {
          callback = object[action];
          _ref = action.split(':'), method = _ref[0], action = _ref[1];
          addCallback.call(this, method, action, callback);
        }
        return this;
      },
      remove: function(action) {
        var method, _ref;
        _ref = action.split(':'), method = _ref[0], action = _ref[1];
        if (action) {
          delete this.actions[method][action];
        } else {
          delete this.actions[method];
        }
        return this;
      },
      removeAll: function() {
        this.actions = {};
        return this;
      },
      describe: function() {
        var action, desc, i, method, routes, start, _i, _j, _len, _ref, _ref1;
        routes = [];
        for (_i = 0, _len = methods.length; _i < _len; _i++) {
          method = methods[_i];
          for (action in this.actions[method]) {
            routes.push("" + path + "/" + action + " " + (method.toUpperCase()) + " => " + this.name + "#" + action);
          }
        }
        _ref = this.singular ? [1, descriptions.singular] : [0, descriptions.plural], start = _ref[0], desc = _ref[1];
        for (i = _j = start, _ref1 = actions.length - 1; start <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = start <= _ref1 ? ++_j : --_j) {
          if (this.actions[actions[i]]) {
            routes.push("" + path + desc[i][1] + " " + (desc[i][0].toUpperCase()) + " => " + this.name + "#" + actions[i]);
          }
        }
        return routes;
      }
    };
  };

  addCallback = function(method, action, callback) {
    var errorMsg, _base;
    errorMsg = "The " + ([method, action].join(':').replace(/:$/, '')) + " action already exists on the '" + this.name + "' resource. Try removing it first.";
    if (action) {
      (_base = this.actions)[method] || (_base[method] = {});
      if (this.actions[method][action]) {
        throw errorMsg;
      }
      return this.actions[method][action] = callback;
    } else {
      if (this.actions[method]) {
        throw errorMsg;
      }
      if (this.singular && method === 'index') {
        throw "Adding index to '" + this.name + "' isn't possible (singular resource).";
      }
      return this.actions[method] = callback;
    }
  };

  handleRequest = function(method, url, options, original, optionsHandler) {
    var action, callback, defaults, index, key, matches, path, pathvar, proceed, proceeded, resource, result, urlParts, vars, _i, _len, _ref, _ref1;
    method = method.toLowerCase();
    _ref = urlParts = parseUrl(url), path = _ref.path, action = _ref.action;
    defaults = {};
    proceeded = false;
    proceed = function(opts) {
      proceeded = true;
      return original(url, optionsHandler(options || {}, opts || {}, defaults));
    };
    for (key in resources) {
      resource = resources[key];
      if (!(matches = path.match(resource.path))) {
        continue;
      }
      if (callback = determineCallback(resource, action, method, matches[matches.length - 2], matches[matches.length - 3])) {
        defaults = resource.defaults;
        vars = {};
        _ref1 = resource.pathvars;
        for (index = _i = 0, _len = _ref1.length; _i < _len; index = ++_i) {
          pathvar = _ref1[index];
          vars[pathvar] = matches[index + 1];
        }
        result = callback(proceed, vars, urlParts);
      }
      if (result !== false && !proceeded) {
        return proceed(result);
      }
      return;
    }
    return original(url, options);
  };

  determineCallback = function(resource, action, method, matchAction, matchIdOrAction) {
    var _ref, _ref1, _ref2, _ref3;
    switch (method) {
      case 'get':
        if ((_ref = resource.actions.get) != null ? _ref[action] : void 0) {
          return resource.actions.get[action];
        }
        switch ((matchIdOrAction ? action : '')) {
          case '':
            return (resource.singular ? resource.actions.show : resource.actions.index);
          case 'new':
            return resource.actions["new"];
          case 'edit':
            return resource.actions.edit;
          default:
            if (!matchAction) {
              return resource.actions.show;
            }
        }
        break;
      case 'put':
        return ((_ref1 = resource.actions.put) != null ? _ref1[action] : void 0) || (!matchAction ? resource.actions.update : void 0);
      case 'post':
        return ((_ref2 = resource.actions.post) != null ? _ref2[action] : void 0) || (!matchIdOrAction ? resource.actions.create : void 0);
      case 'delete':
        return ((_ref3 = resource.actions["delete"]) != null ? _ref3[action] : void 0) || (!matchAction ? resource.actions.destroy : void 0);
    }
  };

  this.Resourcy = {
    removeAll: function() {
      return resources = {};
    },
    handleRequest: handleRequest,
    noConflict: ((_ref = this.Resourcy) != null ? _ref.noConflict : void 0) || function() {
      return delete Resourcy;
    },
    resources: function(path, defaults, actions) {
      if (defaults == null) {
        defaults = {};
      }
      if (actions == null) {
        actions = {};
      }
      return createResource(path, false, defaults).add(actions);
    },
    resource: function(path, defaults, actions) {
      if (defaults == null) {
        defaults = {};
      }
      if (actions == null) {
        actions = {};
      }
      return createResource(path, true, defaults).add(actions);
    },
    routes: function() {
      var path, resource, routes;
      routes = {};
      for (path in resources) {
        resource = resources[path];
        routes[resource.name] = resource.describe();
      }
      return routes;
    }
  };

}).call(this);
