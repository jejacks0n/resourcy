RESOURCES = {
  POSTS: {
    'index':           function() { return 'PostsController#index' },
    'show':            function() { return 'PostsController#show' },
    'new':             function() { return 'PostsController#new' },
    'create':          function() { return 'PostsController#create' },
    'edit':            function() { return 'PostsController#edit' },
    'update':          function() { return 'PostsController#update' },
    'destroy':         function() { return 'PostsController#destroy'},
    'get:comments':    function() { return 'PostsController#comments:GET' },
    'post:reorder':    function() { return 'PostsController#reorder:POST' },
    'delete:comments': function() { return 'PostsController#comments:DELETE' },
    'put:publish':     function() { return 'PostsController#publish:PUT' }
  },
  COMMENTS: {
    'index':           function() { return 'CommentsController#index' },
    'new':             function() { return 'CommentsController#new' },
    'create':          function() { return 'CommentsController#create' },
    'destroy':         function() { return 'CommentsController#destroy' },
    'put:approve':     function() { return 'CommentsController#publish:PUT' }
  },
  OWNER: {
    'show':            function() { return 'OwnerController#show' },
    'new':             function() { return 'OwnerController#new' },
    'create':          function() { return 'OwnerController#create' },
    'edit':            function() { return 'OwnerController#edit' },
    'update':          function() { return 'OwnerController#update' },
    'destroy':         function() { return 'OwnerController#destroy'},
  }
};

window.Resourcy = {
  noConflict: function() {
    window.R = Resourcy;
    delete(window.Resourcy);
  }
};
