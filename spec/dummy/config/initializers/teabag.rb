Teabag.setup do |config|

  config.root = Resourcy::Engine.root

  config.suite do |suite|
    suite.matcher = 'spec/javascripts/*_spec.coffee'
  end

  config.suite :jquery do |suite|
    suite.matcher = 'spec/javascripts/jquery/**/*_spec.coffee'
  end

end
