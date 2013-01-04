# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require 'resourcy/version'

Gem::Specification.new do |s|
  s.name        = 'resourcy-rails'
  s.version     = Resourcy::VERSION
  s.authors     = ['Jeremy Jackson']
  s.email       = ['jejacks0n@gmail.com']
  s.homepage    = 'http://github.com/jejacks0n/resourcy'
  s.summary     = 'Resourcy: Awesome RESTful javascript resource routing'
  s.description = 'A RESTful javascript router that can be used with jquery-ujs and Rails for client route handling'
  s.licenses    = ['MIT']

  s.files       = Dir["{lib,vendor}/**/*"] + ["MIT.LICENSE", "README.md"]
  s.test_files  = Dir["{spec}/**/*"]

  # Runtime Dependencies
  s.add_dependency 'railties', ['>= 3.2.5','< 5']
  s.add_dependency 'coffee-rails'

end
