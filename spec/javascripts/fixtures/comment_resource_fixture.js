var COMMENT_RESOURCE = {
  index: function() {
    return('CommentsController#index');
  },
  'new': function() {
    return 'CommentsController#new';
  },
  create: function() {
    return 'CommentsController#create';
  },
  destroy: function() {
    return 'CommentsController#destroy';
  },
  put: {
    approve: function() {
      return 'CommentsController#publish:PUT';
    }
  }
};
