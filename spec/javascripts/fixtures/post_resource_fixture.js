var POST_RESOURCE = {
  index: function() {
    return('PostsController#index');
  },
  show: function() {
    return 'PostsController#show';
  },
  'new': function() {
    return 'PostsController#new';
  },
  create: function() {
    return 'PostsController#create';
  },
  edit: function() {
    return 'PostsController#edit';
  },
  update: function() {
    return 'PostsController#update';
  },
  destroy: function() {
    return 'PostsController#destroy';
  },
  get: {
    comments: function() {
      return 'PostsController#comments:GET';
    }
  },
  post: {
    reorder: function() {
      return 'PostsController#reorder:POST';
    }
  },
  'delete': {
    comments: function() {
      return 'PostsController#comments:DELETE';
    }
  },
  put: {
    publish: function() {
      return 'PostsController#publish:PUT';
    }
  }
};
