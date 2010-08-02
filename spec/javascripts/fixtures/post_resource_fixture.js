var PostResource = {
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
//      return {
//        onSuccess: function(response) {
//          return 'PostsController#publish:success', response);
//        },
//        onFailure: function(response) {
//          return 'PostsController#publish:failure', response);
//        }
//      }
    }
  }
};
