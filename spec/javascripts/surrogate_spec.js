
describe("Rails.resource", function() {

  beforeEach(function() {
    this.r = Rails.resource('blogs/:blog_id/posts');
    this.func = function() { return 'testing' };
  });

  it('assigns and returns a resource', function() {
    expect(typeof(Rails.resources['blogs/:blog_id/posts'])).toEqual('object');
    expect(this.r).toBeDefined();
  });

  it('returns an resource that has an add method that accepts an object', function() {
    this.r.add({index: this.func});

    expect(this.r.__actions__.index).toEqual(this.func);
  });

  it('has an add method that accepts an action and callback', function() {
    this.r.add('put:activate', this.func);

    expect(this.r.__actions__.put['activate']).toEqual(this.func);
  });

  it("returns its instance for chaining when calling #add", function() {
    expect(this.r.add('put:activate', this.func)).toEqual(this.r);
  });

  it("returns its instance for chaining for dynamically added methods", function() {
    expect(this.r.index(this.func)).toEqual(this.r);
    expect(this.r.show(this.func)).toEqual(this.r);
    expect(this.r['new'](this.func)).toEqual(this.r);
    expect(this.r.create(this.func)).toEqual(this.r);
    expect(this.r.edit(this.func)).toEqual(this.r);
    expect(this.r.update(this.func)).toEqual(this.r);
    expect(this.r.destroy(this.func)).toEqual(this.r);

    expect(this.r.get('comments', this.func)).toEqual(this.r);
    expect(this.r.put('activate', this.func)).toEqual(this.r);
    expect(this.r.post('comments', this.func)).toEqual(this.r);
    expect(this.r['delete']('comments', this.func)).toEqual(this.r);
  });

  it('takes :id path parts out of the path and passes them with their values to the callback', function() {
    var passedVars;
    var spy = spyOn(this.r.__actions__, 'index').andCallFake(function(proceed, vars, url) {
      passedVars = vars;
    });
    new Ajax.Request('/blogs/37/posts', {method: 'get'});

    expect(passedVars).toEqual({blog_id: '37'});
  });

  describe("Basic Resources", function() {
    
    beforeEach(function() {
      this.r = Rails.resource('posts', PostResource);
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
      this.r = Rails.resource('namespace1/namespace2/posts', PostResource);
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
      this.r = Rails.resource('blogs/:blog_id/posts', PostResource);
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
      this.r = Rails.resource('blogs/:blog_id/post', PostResource);
      this.actions = this.r.__actions__;
      this.resourcePath = '/blogs/2/POST';
    });

    // TODO: this *should* really use show, but for now we can get around it by using index
    it('handles the index (aka show) action', function() {
      var spy = spyOn(this.actions, 'index');
      new Ajax.Request(this.resourcePath, {method: 'get'});

      expect(spy.callCount).toEqual(1);
    });

    // TODO: this *should* really use show, but for now we can get around it by using index
    pending('handles the show action', function() {
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

  describe("Proceeds", function() {

    beforeEach(function() {
      this.r = Rails.resource('proceeds/posts', PostResource);
    });

    it('proceeds when it should', function() {
      this.r.index(function(proceed) {
        proceed({
          onSuccess: this.func
        });
      }.bind(this));
      var request = new Ajax.Request('/proceeds/posts', {method: 'get'});

      expect(request.options.onSuccess).toEqual(this.func);
      expect(request.proceeded).toEqual(true);
    });

    it('does not proceed when it should not', function() {
      this.r.index(function() {
        return false;
      });
      var request = new Ajax.Request('/proceeds/posts', {method: 'get'});

      expect(request.proceeded).toBeUndefined();
    });

    it('does not proceeds more than once', function() {
      var func2 = function() { return "this is a second function" };
      this.r.index(function(proceed) {
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

  describe("Usage", function() {

    pending('overwrites existing methods/actions on a pre-existing resource');
    pending('allows for chaining for all methods/actions');
    pending('allows you to pass options back to the proceed function');

  });
});
