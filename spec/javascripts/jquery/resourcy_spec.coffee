#= require jquery-1.8.0
#= require jquery.resourcy
#= require jquery_ujs

describe "Resourcy jQuery Adapter (1.8.0)", ->

  beforeEach ->
    R.removeAll()

  describe "plugin signature", ->

    it "has all the methods it should have", ->
      expect(typeof($.resources)).toBe('function')
      expect(typeof($.resource)).toBe('function')
      expect(typeof($.routes)).toBe('function')
      expect($.handleRequest).toBeUndefined()

    it "removes Resourcy", ->
      expect(window.Resourcy).toBeUndefined()


  describe "plural resources", ->

    beforeEach ->
      spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
      @resource = $.resources('blogs/:blog_id/posts').add(RESOURCES.POSTS)
      @url = '/blogs/1/posts'

    it "handles the index action", ->
      spy = spyOn(@resource.actions, 'index')
      $.ajax(@url, {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the show action", ->
      spy = spyOn(@resource.actions, 'show')
      $.ajax("#{@url}/1", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the new action", ->
      spy = spyOn(@resource.actions, 'new')
      $.ajax("#{@url}/new", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the create action", ->
      spy = spyOn(@resource.actions, 'create')
      $.ajax(@url, {type: 'post'})

      expect(spy.callCount).toBe(1)

    it "handles the edit action", ->
      spy = spyOn(@resource.actions, 'edit')
      $.ajax("#{@url}/1/edit", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the update action", ->
      spy = spyOn(@resource.actions, 'update')
      $.ajax("#{@url}/1", {type: 'put'})

      expect(spy.callCount).toBe(1)

    it "handles the destroy action", ->
      spy = spyOn(@resource.actions, 'destroy')
      $.ajax("#{@url}/1", {type: 'delete'})

      expect(spy.callCount).toBe(1)

    it "handles get members", ->
      spy = spyOn(@resource.actions.get, 'comments')
      $.ajax("#{@url}/1/comments", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles put members", ->
      spy = spyOn(@resource.actions.put, 'publish')
      $.ajax("#{@url}/1/publish", {type: 'put'})

      expect(spy.callCount).toBe(1)

    it "handles post members", ->
      spy = spyOn(@resource.actions.post, 'reorder')
      $.ajax("#{@url}/1/reorder", {type: 'post'})

      expect(spy.callCount).toBe(1)

    it "handles delete members", ->
      spy = spyOn(@resource.actions.delete, 'comments')
      $.ajax("#{@url}/1/comments", {type: 'delete'})

      expect(spy.callCount).toBe(1)

    describe "ajax arguments", ->

      it "accepts the url in the options object", ->
        spy = spyOn(@resource.actions, 'index')
        $.ajax({url: @url, type: 'get'})

        expect(spy.callCount).toBe(1)

      it "falls back to _method if it's provided in the data", ->
        spy = spyOn(@resource.actions, 'create')
        data = [{name: '_method', value: 'post'}]
        $.ajax({url: @url, data: data})

        expect(spy.callCount).toBe(1)


  describe "singular resources", ->

    beforeEach ->
      spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
      @resource = $.resource('blogs/:blog_id/owner').add(RESOURCES.OWNER)
      @url = '/blogs/1/owner'

    it "handles the show action", ->
      spy = spyOn(@resource.actions, 'show')
      $.ajax(@url, {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the new action", ->
      spy = spyOn(@resource.actions, 'new')
      $.ajax("#{@url}/new", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the create action", ->
      spy = spyOn(@resource.actions, 'create')
      $.ajax(@url, {type: 'post'})

      expect(spy.callCount).toBe(1)

    it "handles the edit action", ->
      spy = spyOn(@resource.actions, 'edit')
      $.ajax(@url + '/edit', {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles the update action", ->
      spy = spyOn(@resource.actions, 'update')
      $.ajax(@url, {type: 'put'})

      expect(spy.callCount).toBe(1)

    it "handles the destroy action", ->
      spy = spyOn(@resource.actions, 'destroy')
      $.ajax(@url, {type: 'delete'})

      expect(spy.callCount).toBe(1)

    it "handles get members", ->
      @resource.add('get:blogs', ->)
      spy = spyOn(@resource.actions.get, 'blogs')
      $.ajax("#{@url}/blogs", {type: 'get'})

      expect(spy.callCount).toBe(1)

    it "handles put members", ->
      @resource.add('put:demote', ->)
      spy = spyOn(@resource.actions.put, 'demote')
      $.ajax("#{@url}/demote", {type: 'put'})

      expect(spy.callCount).toBe(1)

    it "handles post members", ->
      @resource.add('post:blogs', ->)
      spy = spyOn(@resource.actions.post, 'blogs')
      $.ajax("#{@url}/blogs", {type: 'post'})

      expect(spy.callCount).toBe(1)

    it "handles delete members", ->
      @resource.add('delete:blog', ->)
      spy = spyOn(@resource.actions.delete, 'blog')
      $.ajax("#{@url}/blog", {type: 'delete'})

      expect(spy.callCount).toBe(1)


  describe "callbacks", ->

    beforeEach ->
      @resource = $.resources('blogs/:blog_id/posts')
      @url = '/blogs/1/posts'
      @callback = -> 'callback'

    describe "passed arguments", ->

      beforeEach ->
        spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
        @resource.add('index', => {success: @callback})
        @actionSpy = spyOn(@resource.actions, 'index').andCallThrough()

      it "passes the proceed function", ->
        $.ajax('/blogs/1/posts', {type: 'get'})

        expect(typeof(@actionSpy.argsForCall[0][0])).toEqual('function')

      it "passes parsed path variables with their values", ->
        $.ajax('/blogs/42/posts', {type: 'get'})

        expect(@actionSpy.argsForCall[0][1]).toEqual({blog_id: '42'})

      it "passes the requests url parts", ->
        $.ajax('http://jejacks0n:password@localhost:3000/blogs/42/posts.json?foo=bar#hash', {type: 'get'})

        expect(@actionSpy.argsForCall[0][2]).toEqual
          scheme: 'http'
          credentials: 'jejacks0n:password'
          host: 'localhost'
          port: '3000'
          path: '/blogs/42/posts'
          action: 'posts'
          format: 'json'
          query: 'foo=bar'
          hash: 'hash'


    describe "returning values", ->

      it "allows returning options that will be used for the request", ->
        @resource.add('index', => {success: @callback})
        spy = spyOn(@, 'callback')

        runs -> $.ajax(@url, {type: 'get'})
        waitsFor -> spy.callCount

        runs -> expect(spy.callCount).toBe(1)

      it "handles the complete callback", ->
        @resource.add('index', => {success: @callback, complete: @callback})
        spy = spyOn(@, 'callback')

        runs -> $.ajax(@url, {type: 'get'})
        waitsFor -> spy.callCount == 2

        runs -> expect(spy.callCount).toBe(2)

      it "handles the beforeSend callback", ->
        spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
        @resource.add('index', => {beforeSend: @callback})
        spy = spyOn(@, 'callback')

        $.ajax(@url, {type: 'get'})

        expect(spy.callCount).toBe(1)

      it "handles the dataFilter callback", ->
        @resource.add('index', => {dataFilter: @callback})
        spy = spyOn(@, 'callback')

        runs -> $.ajax(@url, {type: 'get', dataType: 'json'})
        waitsFor -> spy.callCount

        runs -> expect(spy.argsForCall[0][1]).toBe('json')

      it "handles the error callback", ->
        @resource = $.resources('blogs')
        @resource.add('index', => {error: @callback})
        spy = spyOn(@, 'callback')

        runs -> $.ajax('/blogs', {type: 'get'})
        waitsFor -> spy.callCount

        runs -> expect(spy.callCount).toBe(1)

      describe "and proceeding", ->

        it "proceeds when you return an object", ->
          @resource.add('index', => {success: @callback})
          spy = spyOn(@, 'callback')

          runs -> $.ajax(@url, {method: 'get'})
          waitsFor -> spy.callCount

          runs -> expect(spy.callCount).toBe(1)

        it "doesn't proceed when proceed is called", ->
          @resource.add('index', (proceed) => proceed({success: @callback}))
          spy = spyOn(@, 'callback')

          runs -> $.ajax(@url, {method: 'get'})
          waitsFor -> spy.callCount

          runs -> expect(spy.callCount).toBe(1)

        it "doesn't proceed when returning false", ->
          spy = spyOn(@, 'callback').andCallFake(-> false)
          ajaxSpy = spyOn($, 'originalAjax')
          @resource.add('index', @callback)
          $.ajax(@url, {method: 'get'})

          expect(ajaxSpy.callCount).toBe(0)

        it "doesn't call proceed more than once", ->
          @resource.add 'index', (proceed) =>
            proceed({success: @callback})
            return {success: @callback}
          spy = spyOn(@, 'callback')

          runs -> $.ajax(@url, {method: 'get'})
          waitsFor -> spy.callCount

          runs -> expect(spy.callCount).toBe(1)

  describe "chained callbacks", ->

    beforeEach ->
      @resource = $.resources('blogs/:blog_id/posts')
      @url = '/blogs/1/posts'
      @callback = -> 'callback'

    it "calls both success callbacks", ->
      @resource.add('index', => {success: @callback})
      spy = spyOn(@, 'callback')

      runs -> $.ajax(@url, {method: 'get', success: @callback})
      waitsFor -> spy.callCount == 2

      runs -> expect(spy.callCount).toBe(2)

    it "calls both beforeSend callbacks", ->
      spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
      @resource.add('index', => {beforeSend: @callback})
      spy = spyOn(@, 'callback')

      $.ajax(@url, {type: 'get', beforeSend: @callback})

      expect(spy.callCount).toBe(2)

    it "calls both dataFilter callbacks", ->
      @resource.add('index', => {dataFilter: @callback})
      spy = spyOn(@, 'callback')

      runs -> $.ajax(@url, {type: 'get', dataType: 'json', dataFilter: @callback})
      waitsFor -> spy.callCount == 2

      runs -> expect(spy.argsForCall[1][1]).toBe('json')

    it "calls both complete callbacks", ->
      @resource.add('index', => {complete: @callback})
      spy = spyOn(@, 'callback')

      runs -> $.ajax(@url, {type: 'get', dataType: 'json', complete: @callback})
      waitsFor -> spy.callCount == 2

      runs -> expect(spy.callCount).toBe(2)

    it "calls both error callbacks", ->
      @resource = $.resources('blogs')
      @resource.add('index', => {error: @callback})
      spy = spyOn(@, 'callback')

      runs -> $.ajax('/blogs', {method: 'get', error: @callback})
      waitsFor -> spy.callCount == 2

      runs -> expect(spy.callCount).toBe(2)

    it "allows mixing $.ajax().done() style callbacks", ->
      @resource.add('index', => {success: @callback})
      spy = spyOn(@, 'callback')

      runs -> $.ajax(@url, {method: 'get'}).done(@callback)
      waitsFor -> spy.callCount == 2

      runs -> expect(spy.callCount).toBe(2)


  describe "using UJS", ->

    fixture.load 'ujs.html'

    beforeEach ->
      @resource = $.resources('posts')
      @callback = -> 'callback'

    it "allows :remote => true", ->
      spyOn(window, 'XMLHttpRequest') # keep these requests from being fully requested
      spy = spyOn(@, 'callback')
      @resource.add('show', @callback)
      @resource.add('edit', @callback)

      $('a#show').click()
      expect(spy.callCount).toBe(1)

      $('a#edit').click()
      expect(spy.callCount).toBe(2)

    it "allows :remote => true to call callbacks", ->
      spy = spyOn(@, 'callback')
      @resource.add('show', => {success: @callback})

      runs -> $('a#show').click()
      waitsFor -> spy.callCount

      runs -> expect(spy.callCount).toBe(1)
