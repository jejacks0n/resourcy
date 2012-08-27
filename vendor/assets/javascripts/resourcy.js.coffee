# private resource list
resources = {}

# used to describe routes
methods = ['get', 'put', 'post', 'delete']
actions = ['index', 'create', 'new', 'edit', 'show', 'update', 'delete']
descriptions =
  plural: [['get', ''], ['post', ''], ['get', '/new'], ['get', '/:id/edit'], ['get', '/:id'], ['put', '/:id'], ['delete', '/:id']]
  singular: [null, ['post', ''], ['get', '/new'], ['get', '/edit'], ['get', ''], ['put', ''], ['delete', '']]

parseUrl = (url) ->
  url = url.match(/^((http[s]?|ftp):\/\/)?(((.+)@)?([^:\/\?#\s]+)(:(\d+))?)?(\/?[^\?#\.]+)?(\.([^\?#]+))?(\?([^#]*))?(#(.*))?$/i) or []
  path = url[9]?.match(/(\/.*)\/+(\w+)$/i) or []
  return scheme: url[2], credentials: url[5], host: url[6], port: url[8], path: url[9], action: path[2] or '', format: url[11], query: url[13], hash: url[15]

createResource = (path, singular = false) =>
  return resources[path] if resources[path]
  return resources[path] =
    path: new RegExp("^#{(if path[0] is '/' then path else "/#{path}").replace(/:\w+/ig, '(\\w+)')}/?(\\w+)?/?(\\w+)?/?($|\\?|\\.|#)", 'i')
    pathvars: (path.match(/:(\w+)/ig) or []).join('|').replace(/:/g, '').split('|') # todo: this seems wonky
    actions: {}
    singular: singular
    name: path.substr(path.lastIndexOf('/') + 1)
    add: (action, callback) ->
      object = {}
      if typeof(action) is 'string' then object[action] = callback else object = action
      for action, callback of object
        [method, action] = action.split(':')
        addCallback.call(@, method, action, callback)
      return @
    remove: (action) ->
      [method, action] = action.split(':')
      if action then delete(@actions[method][action]) else delete(@actions[method])
      return @
    removeAll: ->
      @actions = {}
      return @
    describe: ->
      routes = []
      for method in methods
        for action of @actions[method]
          routes.push("#{path}/#{action} #{method.toUpperCase()} => #{@name}##{action}")
      [start, desc] = if @singular then [1, descriptions.singular] else [0, descriptions.plural]
      for i in [start..actions.length - 1]
        if @actions[actions[i]]
          routes.push("#{path}#{desc[i][1]} #{desc[i][0].toUpperCase()} => #{@name}##{actions[i]}")
      return routes

addCallback = (method, action, callback) ->
  errorMsg = "The #{([method, action].join(':').replace(/:$/, ''))} action already exists on the '#{@name}' resource. Try removing it first."
  if action
    @actions[method] ||= {}
    throw errorMsg if @actions[method][action]
    @actions[method][action] = callback
  else
    throw errorMsg if @actions[method]
    throw "Adding index to '#{@name}' isn't possible (singular resource)." if @singular and method is 'index'
    @actions[method] = callback

handleRequest = (method, url, options, original, optionsHandler) ->
  method = method.toLowerCase()
  {path, action} = urlParts = parseUrl(url)

  proceeded = false
  proceed = (opts) ->
    proceeded = true
    return original(url, optionsHandler(options or {}, opts or {}))

  for key, resource of resources
    continue unless matches = path.match(resource.path)
    if callback = determineCallback(resource, action, method, matches[matches.length - 2], matches[matches.length - 3])
      vars = {}
      vars[pathvar] = matches[index + 1] for pathvar, index in resource.pathvars
      result = callback(proceed, vars, urlParts)
    return proceed(result) if result != false and !proceeded
    return

  return original(url, options)

determineCallback = (resource, action, method, matchAction, matchIdOrAction) ->
  switch method
    when 'get'
      return resource.actions.get[action] if resource.actions.get?[action]
      switch (if matchIdOrAction then action else '')
        when '' then return (if resource.singular then resource.actions.show else resource.actions.index)
        when 'new' then return resource.actions.new
        when 'edit' then return resource.actions.edit
        else return resource.actions.show unless matchAction
    when 'put' then return resource.actions.put?[action] or (resource.actions.update unless matchAction)
    when 'post' then return resource.actions.post?[action] or (resource.actions.create unless matchIdOrAction)
    when 'delete' then return resource.actions.delete?[action] or (resource.actions.destroy unless matchAction)


@Resourcy =
  removeAll: -> resources = {}
  handleRequest: handleRequest
  noConflict: Resourcy.noConflict or -> delete(Resourcy)

  resources: (path, actions = {}) -> return createResource(path).add(actions)
  resource: (path, actions = {}) -> return createResource(path, true).add(actions)
  routes: ->
    routes = {}
    routes[resource.name] = resource.describe() for path, resource of resources
    return routes
