#= require resourcy
optionsHandler = (opts1, opts2) ->
  options = jQuery.extend(true, {}, opts1, opts2)
  for method in ['beforeSend', 'error', 'dataFilter', 'success', 'complete']
    if opts1[method] && opts2[method]
      c1 = opts1[method]
      c2 = opts2[method]
      options[method] = ->
        c1.apply(window, arguments)
        c2.apply(window, arguments)
  return options

original = jQuery.ajax
handleRequest = Resourcy.handleRequest
jQuery.extend(jQuery, {originalAjax: original, resources: Resourcy.resources, resource: Resourcy.resource, routes: Resourcy.routes})
Resourcy.noConflict()
jQuery.ajax = (url, options = {}) ->
  if typeof(url) is 'object'
    options = url
    url = options.url
  for data in options.data || []
    if data.name is '_method'
      method = data.value
      break
  return handleRequest(method || options.type || 'get', url, options, jQuery.originalAjax, optionsHandler)
