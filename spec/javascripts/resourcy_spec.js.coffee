require '/assets/resourcy.js'

describe "Resourcy", ->

  beforeEach ->
    Resourcy.removeAll()

  describe ".resources (creating a plural resource)", ->

    beforeEach ->
      @resource = Resourcy.resources('blogs/:blog_id/posts')

    it "returns a resource", ->
      expect(typeof(@resource)).toBe('object')

    it "sets information on the resource", ->
      expect(@resource.pathvars).toEqual(['blog_id'])
      expect(@resource.actions).toEqual({})
      expect(@resource.singular).toBe(false)
      expect(@resource.name).toBe('posts')

    it "has an add, remove, and describe method", ->
      expect(typeof(@resource.add)).toBe('function')
      expect(typeof(@resource.remove)).toBe('function')
      expect(typeof(@resource.describe)).toBe('function')

    it "can find an existing resource and return it", ->
      r2 = Resourcy.resources('blogs/:blog_id/posts')
      expect(r2).toBe(@resource)


  describe ".resource (creating a singular resource)", ->

    beforeEach ->
      @resource = Resourcy.resource('blogs/:blog_id/owner')

    it "returns a resource", ->
      expect(typeof(@resource)).toBe('object')

    it "sets information on the resource", ->
      expect(@resource.pathvars).toEqual(['blog_id'])
      expect(@resource.actions).toEqual({})
      expect(@resource.singular).toBe(true)
      expect(@resource.name).toBe('owner')

    it "has an add, remove, and describe method", ->
      expect(typeof(@resource.add)).toBe('function')
      expect(typeof(@resource.remove)).toBe('function')
      expect(typeof(@resource.describe)).toBe('function')

    it "can find an existing resource and return it", ->
      r2 = Resourcy.resource('blogs/:blog_id/owner')

      expect(r2).toBe(@resource)


  describe ".routes", ->

    beforeEach ->
      Resourcy.resources('blogs/:blog_id/posts')
      Resourcy.resource('blogs/:blog_id/owner')

    it "returns an object of registered resources", ->
      expect(Resourcy.routes()).toEqual({owner: [], posts: []})

    it "calls describe on all the resources", ->
      spyOn(Resourcy.resources('blogs/:blog_id/posts'), 'describe').andCallFake(-> ['posts => foo'])
      spyOn(Resourcy.resources('blogs/:blog_id/owner'), 'describe').andCallFake(-> ['owner => foo'])

      expect(Resourcy.routes()).toEqual({owner: ['owner => foo'], posts: ['posts => foo']})


  describe ".noConflict", ->

    it "removes Resourcy", ->
      Resourcy.noConflict() # in specs we've overridden noConflict to assign it to R (and remove it like normal)

      expect(window.Resourcy).toBeUndefined()
      window.Resourcy = window.R # and put it back now


  describe "plural resources", ->

    beforeEach ->
      @resource = Resourcy.resources('blogs/:blog_id/posts')
      @callback = -> 'callback'

    describe "#add", ->

      it "accepts an object, and adds to the actions", ->
        @resource.add({index: @callback})

        expect(@resource.actions.index).toBe(@callback)

      it "accepts an string and callback, and adds to the actions", ->
        @resource.add('put:activate', @callback)

        expect(@resource.actions.put['activate']).toBe(@callback)

      it "doesn't allow adding the same action more than once", ->
        @resource.add({index: @callback})

        expect(=> @resource.add({index: @callback}))
          .toThrow("The index action already exists on the 'posts' resource. Try removing it first.")

      it "returns itself for chaining", ->
        expect(@resource.add('put:activate', @callback)).toBe(@resource)


    describe "#remove", ->

      beforeEach ->
        @resource.add('index', @callback)
        @resource.add('put:activate', @callback)

      it "removes the action", ->
        expect(@resource.actions.index).toBe(@callback)
        expect(@resource.actions.put['activate']).toBe(@callback)

        @resource.remove('index')
        @resource.remove('put:activate')

        expect(@resource.actions.index).toBeUndefined()
        expect(@resource.actions.put['activate']).toBeUndefined()

      it "returns itself for chaining", ->
        expect(@resource.remove('index')).toBe(@resource)


    describe "#removeAll", ->

      beforeEach ->
        @resource.add('index', @callback)
        @resource.add('put:activate', @callback)

      it "clears all actions", ->
        expect(@resource.actions.index).toBe(@callback)
        expect(@resource.actions.put['activate']).toBe(@callback)

        @resource.removeAll()

        expect(@resource.actions).toEqual({})

      it "returns itself for chaining", ->
        expect(@resource.removeAll()).toBe(@resource)


    describe "#describe", ->

      beforeEach ->
        @resource.add('index', @callback)
        @resource.add('put:activate', @callback)

      it "returns an array describing the resource actions", ->
        expect(@resource.describe()).toEqual(['blogs/:blog_id/posts/activate PUT => posts#activate', 'blogs/:blog_id/posts GET => posts#index'])


  describe "singular resources", ->

    beforeEach ->
      @resource = Resourcy.resource('blogs/:blog_id/owner')
      @callback = -> 'callback'

    describe "#add", ->

      it "doesn't allow adding the index action", ->
        expect(=> @resource.add('index')).toThrow("Adding index to 'owner' isn't possible (singular resource).")


    describe "#describe", ->

      beforeEach ->
        @resource.add('show', @callback)
        @resource.add('put:activate', @callback)

      it "returns an array describing the resource actions", ->
        expect(@resource.describe()).toEqual(['blogs/:blog_id/owner/activate PUT => owner#activate', 'blogs/:blog_id/owner GET => owner#show'])
