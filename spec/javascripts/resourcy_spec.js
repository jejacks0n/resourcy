
describe("Rails.routes", function() {

  beforeEach(function() {
    try {spyOn(window, 'XMLHttpRequest')} catch(e) {}
    try {spyOn(window, 'ActiveXObject')} catch(e) {}

    Rails.resources = {};
    this.r = Rails.resource('blogs/:blog_id/posts').add(POST_RESOURCE);
  });

  it('returns an array of routes', function() {
    Rails.resource('blogs/:blog_id/posts/:post_id/comment', true).add(COMMENT_RESOURCE);

    expect(Rails.routes().join('\n')).toEqual(ROUTE_DESCRIPTION);
  });

});

describe("Rails.resource", function() {

  beforeEach(function() {
    // we don't really want any requests to go through for speed reasons
    try {spyOn(window, 'XMLHttpRequest')} catch(e) {}
    try {spyOn(window, 'ActiveXObject')} catch(e) {}

    Rails.resources = {};
    this.r = Rails.resource('blogs/:blog_id/posts');
    this.actions = this.r.__actions__;
    this.func = function() { return 'testing' };
  });

  it('assigns and returns a resource', function() {
    expect(typeof(Rails.resources['blogs/:blog_id/posts'])).toEqual('object');
    expect(this.r).toBeDefined();
  });

  it('can find an existing resource and returns that one', function() {
    var r2 = Rails.resource('blogs/:blog_id/posts');

    expect(r2).toEqual(this.r);
  });

  it('returns a resource that has an add method that accepts an object', function() {
    this.r.add({index: this.func});

    expect(this.actions.index).toEqual(this.func);
  });

  it('has an add method that accepts an action and callback', function() {
    this.r.add('put:activate', this.func);

    expect(this.actions.put['activate']).toEqual(this.func);
  });

  it('does not allow adding the same action or member more than once', function() {
    this.r.add({index: this.func});
    var func = function() {
      this.r.add('index', this.func)
    }.bind(this);

    expect(func).toThrow("That action already exists on the 'blogs/:blog_id/posts' resource. Try removing it first.");
  });
  
  it('has a remove method that accepts an action', function() {
    this.r.add('index', this.func);
    this.r.add('put:activate', this.func);

    expect(this.actions.put['activate']).toEqual(this.func);
    expect(this.actions['index']).toEqual(this.func);

    this.r.remove('index');
    this.r.remove('put:activate');

    expect(this.actions.put['activate']).toEqual(undefined);
    expect(this.actions['index']).toEqual(undefined);
  });

  it("returns its instance for chaining when calling add", function() {
    expect(this.r.add('put:activate', this.func)).toEqual(this.r);
  });

  it('takes :id path parts out of the path and passes them with their values to the callback', function() {
    this.r.add({index: this.func});
    var passedVars;
    var spy = spyOn(this.actions, 'index').andCallFake(function(proceed, vars, url) {
      passedVars = vars;
    });
    new Ajax.Request('/blogs/37/posts', {method: 'get'});

    expect(passedVars).toEqual({blog_id: '37'});
  });

  describe("Basic Resources", function() {
    
    beforeEach(function() {
      this.r = Rails.resource('posts').add(POST_RESOURCE);
      this.actions = this.r.__actions__;
      this.resourcePath = '/POSTS';
    });

    it('handles the index action', function() {
      var spy = spyOn(this.actions, 'index');
      new Ajax.Request(this.resourcePath, {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the show action', function() {
      var spy = spyOn(this.actions, 'show');
      new Ajax.Request(this.resourcePath + '/1', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the new action', function() {
      var spy = spyOn(this.actions, 'new');
      new Ajax.Request(this.resourcePath + '/new', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the create action', function() {
      var spy = spyOn(this.actions, 'create');
      new Ajax.Request(this.resourcePath, {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the edit action', function() {
      var spy = spyOn(this.actions, 'edit');
      new Ajax.Request(this.resourcePath + '/1/edit', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the update action', function() {
      var spy = spyOn(this.actions, 'update');
      new Ajax.Request(this.resourcePath + '/1', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the destroy action', function() {
      var spy = spyOn(this.actions, 'destroy');
      new Ajax.Request(this.resourcePath + '/1', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles get members', function() {
      var spy = spyOn(this.actions.get, 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles put members', function() {
      var spy = spyOn(this.actions.put, 'publish');
      new Ajax.Request(this.resourcePath + '/1/publish', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles post members', function() {
      var spy = spyOn(this.actions.post, 'reorder');
      new Ajax.Request(this.resourcePath + '/1/reorder', {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles delete members', function() {
      var spy = spyOn(this.actions['delete'], 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });
  });

  describe("Namespaced Resources", function() {

    beforeEach(function() {
      this.r = Rails.resource('namespace1/namespace2/posts').add(POST_RESOURCE);
      this.actions = this.r.__actions__;
      this.resourcePath = '/namespace1/namespace2/POSTS';
    });

    it('handles the index action', function() {
      var spy = spyOn(this.actions, 'index');
      new Ajax.Request(this.resourcePath, {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the show action', function() {
      var spy = spyOn(this.actions, 'show');
      new Ajax.Request(this.resourcePath + '/1', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the new action', function() {
      var spy = spyOn(this.actions, 'new');
      new Ajax.Request(this.resourcePath + '/new', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the create action', function() {
      var spy = spyOn(this.actions, 'create');
      new Ajax.Request(this.resourcePath, {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the edit action', function() {
      var spy = spyOn(this.actions, 'edit');
      new Ajax.Request(this.resourcePath + '/1/edit', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the update action', function() {
      var spy = spyOn(this.actions, 'update');
      new Ajax.Request(this.resourcePath + '/1', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the destroy action', function() {
      var spy = spyOn(this.actions, 'destroy');
      new Ajax.Request(this.resourcePath + '/1', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles get members', function() {
      var spy = spyOn(this.actions.get, 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles put members', function() {
      var spy = spyOn(this.actions.put, 'publish');
      new Ajax.Request(this.resourcePath + '/1/publish', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles post members', function() {
      var spy = spyOn(this.actions.post, 'reorder');
      new Ajax.Request(this.resourcePath + '/1/reorder', {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles delete members', function() {
      var spy = spyOn(this.actions['delete'], 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });
  });

  describe("Nested Resources", function() {

    beforeEach(function() {
      this.r = Rails.resource('blogs/:blog_id/posts').add(POST_RESOURCE);
      this.actions = this.r.__actions__;
      this.resourcePath = '/blogs/1/POSTS';
    });

    it('handles the index action', function() {
      var spy = spyOn(this.actions, 'index');
      new Ajax.Request(this.resourcePath, {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the show action', function() {
      var spy = spyOn(this.actions, 'show');
      new Ajax.Request(this.resourcePath + '/1', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the new action', function() {
      var spy = spyOn(this.actions, 'new');
      new Ajax.Request(this.resourcePath + '/new', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the create action', function() {
      var spy = spyOn(this.actions, 'create');
      new Ajax.Request(this.resourcePath, {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the edit action', function() {
      var spy = spyOn(this.actions, 'edit');
      new Ajax.Request(this.resourcePath + '/1/edit', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the update action', function() {
      var spy = spyOn(this.actions, 'update');
      new Ajax.Request(this.resourcePath + '/1', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the destroy action', function() {
      var spy = spyOn(this.actions, 'destroy');
      new Ajax.Request(this.resourcePath + '/1', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles get members', function() {
      var spy = spyOn(this.actions.get, 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles put members', function() {
      var spy = spyOn(this.actions.put, 'publish');
      new Ajax.Request(this.resourcePath + '/1/publish', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles post members', function() {
      var spy = spyOn(this.actions.post, 'reorder');
      new Ajax.Request(this.resourcePath + '/1/reorder', {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles delete members', function() {
      var spy = spyOn(this.actions['delete'], 'comments');
      new Ajax.Request(this.resourcePath + '/1/comments', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });
  });

  describe("Singular Resource", function() {

    beforeEach(function() {
      this.r = Rails.resource('blogs/:blog_id/post', true).add(POST_RESOURCE);
      this.actions = this.r.__actions__;
      this.resourcePath = '/blogs/2/POST';
    });

    pending('does not handles the index action', function() {
      this.r.add('index', this.func);
      
      expect(this.actions['index']).toEqual(undefined);
    });

    it('handles the show action', function() {
      var spy = spyOn(this.actions, 'show');
      new Ajax.Request(this.resourcePath, {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the new action', function() {
      var spy = spyOn(this.actions, 'new');
      new Ajax.Request(this.resourcePath + '/new', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the create action', function() {
      var spy = spyOn(this.actions, 'create');
      new Ajax.Request(this.resourcePath, {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the edit action', function() {
      var spy = spyOn(this.actions, 'edit');
      new Ajax.Request(this.resourcePath + '/edit', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the update action', function() {
      var spy = spyOn(this.actions, 'update');
      new Ajax.Request(this.resourcePath, {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles the destroy action', function() {
      var spy = spyOn(this.actions, 'destroy');
      new Ajax.Request(this.resourcePath, {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles get members', function() {
      var spy = spyOn(this.actions.get, 'comments');
      new Ajax.Request(this.resourcePath + '/comments', {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles put members', function() {
      var spy = spyOn(this.actions.put, 'publish');
      new Ajax.Request(this.resourcePath + '/publish', {method: 'put'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles post members', function() {
      var spy = spyOn(this.actions.post, 'reorder');
      new Ajax.Request(this.resourcePath + '/reorder', {method: 'post'});

      expect(spy.callCount).toEqual(1);
    });

    it('handles delete members', function() {
      var spy = spyOn(this.actions['delete'], 'comments');
      new Ajax.Request(this.resourcePath + '/comments', {method: 'delete'});

      expect(spy.callCount).toEqual(1);
    });
  });

  describe("Returning from callbacks", function() {

    it('allows you to return options that will be used in the ajax request', function() {
      var func2 = function() { return "this is a second function" };
      this.r.add('index', function() {
        return {
          onSuccess: this.func
        }
      }.bind(this));
      var request = new Ajax.Request('/blogs/1/posts', {method: 'get'});

      expect(request.options.onSuccess).toEqual(this.func);
    });

  });

  describe("Proceeds", function() {

    beforeEach(function() {
      this.r = Rails.resource('proceeds/posts');
    });

    it('proceeds when it should', function() {
      this.r.add('index', function(proceed) {
        proceed({
          onSuccess: this.func
        });
      }.bind(this));
      var request = new Ajax.Request('/proceeds/posts', {method: 'get'});

      expect(request.options.onSuccess).toEqual(this.func);
      expect(request.proceeded).toEqual(true);
    });

    it('does not proceed when it should not', function() {
      this.r.add('index', function() {
        return false;
      });
      var request = new Ajax.Request('/proceeds/posts', {method: 'get'});

      expect(request.proceeded).toBeUndefined();
    });

    it('does not call proceed more than once', function() {
      var func2 = function() { return "this is a second function" };
      this.r.add('index', function(proceed) {
        proceed({
          onSuccess: func2
        });
        return {
          onSuccess: this.func
        }
      }.bind(this));
      var request = new Ajax.Request('/proceeds/posts', {method: 'get'});

      expect(request.options.onSuccess).toEqual(func2);
    });
  });

  describe("Chaining callbacks/options", function() {

    pending('allows you to chain actions, calling the last added first', function() {});
    pending('breaks the chain when a callback returns false', function() {});

  });

});
