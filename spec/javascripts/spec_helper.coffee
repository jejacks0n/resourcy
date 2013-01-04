window.RESOURCES =
  POSTS:
    'index':           -> 'PostsController#index'
    'show':            -> 'PostsController#show'
    'new':             -> 'PostsController#new'
    'create':          -> 'PostsController#create'
    'edit':            -> 'PostsController#edit'
    'update':          -> 'PostsController#update'
    'destroy':         -> 'PostsController#destroy'
    'get:comments':    -> 'PostsController#comments:GET'
    'post:reorder':    -> 'PostsController#reorder:POST'
    'delete:comments': -> 'PostsController#comments:DELETE'
    'put:publish':     -> 'PostsController#publish:PUT'
  COMMENTS:
    'index':           -> 'CommentsController#index'
    'new':             -> 'CommentsController#new'
    'create':          -> 'CommentsController#create'
    'destroy':         -> 'CommentsController#destroy'
    'put:approve':     -> 'CommentsController#publish:PUT'
  OWNER:
    'show':            -> 'OwnerController#show'
    'new':             -> 'OwnerController#new'
    'create':          -> 'OwnerController#create'
    'edit':            -> 'OwnerController#edit'
    'update':          -> 'OwnerController#update'
    'destroy':         -> 'OwnerController#destroy'

window.Resourcy =
  noConflict: ->
    window.R = Resourcy;
    delete(window.Resourcy);
