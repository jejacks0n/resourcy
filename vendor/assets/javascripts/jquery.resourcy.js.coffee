#= require resourcy
#
# Resourcy Ajax adapter
#
# This overrides the default jQuery.ajax method and mixes in the logic required to make Resourcy work with the options
# and arguments for the jQuery Ajax api.

# Get the original jQuery.ajax and merge in some additional methods from Resourcy.
original = jQuery.ajax
jQuery.extend(jQuery, {originalAjax: original, resources: Resourcy.resources, resource: Resourcy.resource, routes: Resourcy.routes})

# Remove Resourcy from the global namespace.
handleRequest = Resourcy.handleRequest
Resourcy.noConflict()

# Define an options handler, that properly merges options for the Ajax request.
optionsHandler = (opts1, opts2, defaults = {}) ->
  options = jQuery.extend(true, {}, opts1, opts2, defaults)
  for method in ['beforeSend', 'error', 'dataFilter', 'success', 'complete']
    if opts1[method] && opts2[method]
      c1 = opts1[method]
      c2 = opts2[method]
      options[method] = ->
        c1.apply(window, arguments)
        c2.apply(window, arguments)
  return options

# Create a new jQuery.ajax method that works with Resourcy.
jQuery.ajax = (url, options = {}) ->
  if typeof(url) is 'object'
    options = url
    url = options.url
  for data in options.data || []
    if data.name is '_method'
      method = data.value
      break
  return handleRequest(method || options.type || 'get', url, options, jQuery.originalAjax, optionsHandler)
