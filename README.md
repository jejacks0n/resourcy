# Resourcy

[![Gem Version](https://img.shields.io/gem/v/resourcy.svg)](https://rubygems.org/gems/resourcy)
[![Build Status](https://secure.travis-ci.org/jejacks0n/resourcy.png)](http://travis-ci.org/jejacks0n/resourcy)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

Resourcy is a RESTful adapter that observes Ajax requests matching specific paths and methods and is meant to work with
[jquery-ujs](https://github.com/rails/jquery-ujs).  It's small (~3.3k), and is intended to be useful anywhere, while
taking advantage of Rails conventions and the jquery-ujs library when possible.

It provides simple hooks for all the standard REST actions (index, show, new, create, edit, update, and destroy), and
the ability to add and remove members (get, put, post, and delete actions) on a given resource.  It's important to note
that you're only defining routes you want to handle in javascript.

You can add this behavior onto links and forms by setting a `data-remote="true"` attribute, and in Rails you can use
the standard `:remote => true`.  Then just use Resourcy to hook into those actions.  Read more about what's possible
on the [jquery-ujs wiki](https://github.com/rails/jquery-ujs/wiki/Unobtrusive-scripting-support-for-jQuery).


## The Story

There's not a great way to handle remote links and forms right now.. There's ways, but they're not especially elegant.
So, let's take a quick look at how you can accomplish this currently:

Let's say we have a link that when clicked, updates some content on the page based on a JSON response from the server.
In the view you can can build a link:

    <a href="/posts/1/activate" data-remote="true">Activate Post</a>

This is absolutely great.. simple, concise and communicates very useful information to other developers that we're
doing something specific with this link.  Now, there's a few feasible options for handling this sort of remote link.

- We drop the `:remote => true` and put an id on the link so we can find it, observe clicks on it, and do the Ajax
custom style.. totally fine, but doesn't communicate as clearly that there's stuff being handled on the client and that
the server should be responding to our link in a particular way.

- We add an id to the link so we can find it, leaving the `:remote => true` intact.  Rails jquery-ujs allows us to
handle some of the Ajax events by firing custom events during the Ajax process, so (again) we find the element, but
instead of observing click, we attach some observers for "ajax:before" (maybe we want to animate in a loading
indicator?), "ajax:success", "ajax:failure", and potentially more.  That gets the job done, I guess, but not elegantly.

- We use some framework like Spine or Backbone (or god forbid we write our own) to reflect models, controllers, and
views on the client.  This is actually a really great solution in many many cases, but do I want all of that overhead
for something simple?  Not really.

So none of those options sounded great to me.  But what if we watched the Ajax requests themselves, and were able to
listen to specific methods and potentially handle the default REST actions?  Right, who couldn't like that idea?  It's
very friendly, and allows us room to play.

Here's a simple example of how it can be used (CoffeeScript):

    $.resources('posts').add 'show', ->
      success: -> alert('Yay!')
      fail: -> alert('Boo!')

Simple and concise.. Now whenever a link is clicked with the url that matches /posts/:post_id (in RESTful terms, show
on the Posts resource) we can handle it.  We can also put this code where it seems appropriate in the context that we
might need it.  The best part is that this is just the simplest example.


## Installation

### Rails

    gem 'resourcy-rails'

Then require resourcy (and jquery-ujs) in your application.js:

    //= require jquery.resourcy

### Just the Javascripts?

Grab [jquery.resourcy.js](http://github.com/jejacks0n/resourcy/raw/master/distro/jquery.resourcy.js) or [jquery.resourcy.min.js](http://github.com/jejacks0n/resourcy/raw/master/distro/jquery.resourcy.min.js)
and put it in your project.  If you're not using jQuery you can grab [resourcy.js](http://github.com/jejacks0n/resourcy/raw/master/distro/resourcy.js)
and call it directly use `Resourcy.resource` instead of `$.resource`.


## Usage

Put a `data-remote="true"` attribute on any link or form elements you want to be handled remotely.  If you're using
Rails, this is as easy as adding `:remote => true` to your links and forms.

In these examples I'm using coffeescript, because it's just easier to read -- and simpler with the callbacks.  It's
worth noting that these examples are simple, and you might want to assign your callbacks differently -- instead of
nesting them like I do in the examples.

Let's say you have a Posts class, and that it handles the user interface around browsing blog posts -- updating various
elements on the page when you paginate through them etc.

    class Posts
      constructor: ->
        @display = $('#post_display')
        $.resources('posts').add('index', @loadPage)

      loadPage: =>
        @display.addClass('loading')
        success: (data) ->
          @display.removeClass('loading').html(data)
        fail: ->
          @display.removeClass('loading')
          alert('Unable to load that page.')

Notice how we didn't observe any clicking on links or buttons?  We don't care about that anymore, because we don't have
to.  Whenever an Ajax request to PostsController#index happens we can handle it how we want.  Since we're wanting to
handle the index action on the PostsController we indicate that when we add it using the `$.resources` method.

This means that we can put those pagination links wherever we want, potentially add more, or change how they work..
without ever having to touch the client code!

Now let's consider adding a show view for blog posts.  Currently when I click to view a specific blog post it takes me
to the show view -- and when I click the back button I lose the page I was on.. So lame!  Let's just show the blog post
on the page we're on, so we don't have to refresh the page.  We update our controller to respond to JSON, and do a
little refactor in our constructor (so you can see a slightly different usage pattern) like so:

    $.resources('posts').add
      index: @loadPage
      show: @loadDetail

Notice we've added one line of code to handle the new action, no matter how many links may exist.. We don't have to find
and observe any of them.  Now it's simply a matter of adding `data-remote="true"` to the links in the index view, and
writing a loadDetail method.

### Nested resources & namespacing

Resourcy handles namespaces and nested resources as well.  It's just part of the resource you pass it, so for example,
if you have the nested resource "comments" under "posts", you would just use the path to that resource.. eg.
'posts/:post_id/comments'.  This will automatically make a nested resource, which means that if you don't care to do
anything for posts, you don't have to declare it as a resource itself.

#### Nested resources

    $.resources('blogs/:blog_id/posts')

#### Namespacing

    $.resources('my_blog/admin/posts')

#### Default options

You can add default options for a given resource.  For example you may want to tell the resource to always request
using the html format, or setting a header.

    $.resources('posts', dataType: 'html', headers: {X_PJAX: true})
    # or $.resources('posts').options(dataType: 'html', headers: {X_PJAX: true})

### Singular resources

Singular resources work the same way, but are added using the `resource` (singular) method.  The only real difference
with singular resources is that they have a show action where normally there's an index action, and there is no index
action.  To specify something is a singular resource use:

    $.resource('posts/:post_id/author', true).add
      show: -> alert('This will monitor GET to /posts/1/author')

### Adding actions

You can add actions and members to a given resource by using the `add` method (which supports chaining).

    r = $.resources('posts').
      add('index',       ->).
      add('show',        ->)

    r.add('new',         ->).
      add('create',      ->).
      add('edit',        ->).
      add('update',      ->).
      add('destroy',     ->).
      add('put:publish', ->).
      add('put:archive', ->)

    $.resources('posts/:post_id/comments').add
      index: ->
      show: ->
      new: ->
      create: ->
      edit: ->
      update: ->
      destroy: ->
      'put:upvote': ->
      'put:downvote': ->

You can also pass the actions as an object to the `resource` and `resources` methods.  Here's an example of creating a
resource with default ajax options and new/create actions on it.

    $.resources 'posts', {dataType: 'html'},
      new: ->
      create: ->


### Removing actions

There are times when you may want to remove an existing action on a resource -- for example to override already
assigned behavior (in a subclass or whatever).  You can accomplish this by using the `remove` method.

    r = $.resources('posts').add('index', ->)
    r.remove('index')
    # or $.resources('posts').remove('index')

### Callbacks

Your callbacks can return a few things to control what happens to the Ajax request after you've done what you want.
Your function is called directly before the Ajax request is made, so you have control over if the Ajax request goes
through or not, as well as what options it should use.

#### Returning false

To keep the Ajax request from continuing simply return false.  This will stop the request, which let's you do custom
confirm dialogs etc.  We'll use the example above as a starting point for some of these examples as well.

    # you can stop the ajax request by returning false
    loadDetails: => confirm('Are you sure?')

#### Returning options

You can also control the options the Ajax request will use by returning them.  This allows you to setup things like
success and other callbacks.

    loadDetails: =>
      # you can return an options object that will be used by the Ajax request
      dataType: 'html'
      success: -> alert('You loaded the details!')

#### Arguments

The callbacks are passed a few arguments when they're called.  These are important because they give you a lot of
flexibility.  The arguments are:

- `proceed` a callback function that can be called to continue the Ajax request (useful for animating or something
  before actually sending the request)

- `pathVars` variables that are from the path -- if the resource was 'blogs/:blog_id/posts' for example, this would be
  something like: `{blog_id: '42'}`

      loadDetails: (proceed, pathVars) ->
        # you can use the proceed function to pass as a callback or call it yourself
        # if you pass it as a callback and it isn't called immediately you should return false so it isn't called for you

        # this will wait 10 seconds before making the actual ajax request
        setTimeout ->
          proceed
            success: -> alert('You loaded the details for ' + pathVars['blog_id'] + '!')
            fail: -> alert('Post not found')
        , 10000
        return false

### Describing routes

Since Resourcy is basically a routing system it can be useful to see all of the routes you're listening for.  The
`routes` method returns an array of all of the resources and actions as route descriptions.

    $.routes()


## Parting thoughts

Resourcy isn't intended as a way to build complex javascript applications.  This is just another tool in your toolbox
and should be used as such.  Frameworks like Spine.js and Backbone will give you a lot more functionality, but Resourcy
is useful when used in the correct ways.


## License

Licensed under the [MIT License](http://opensource.org/licenses/mit-license.php)

Copyright 2012 [Jeremy Jackson](https://github.com/jejacks0n)


## Enjoy =)
