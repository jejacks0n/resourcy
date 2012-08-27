# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)
require 'resourcy/version'

Gem::Specification.new do |s|

  # General Gem Information
  s.name        = 'resourcy-rails'
  s.date        = '2012-08-11'
  s.version     = Resourcy::VERSION
  s.authors     = ['Jeremy Jackson']
  s.email       = ['jejacks0n@gmail.com']
  s.homepage    = 'http://github.com/jejacks0n/resourcy'
  s.summary     = %Q{Resourcy: an unobtrusive RESTful adapter}
  s.description = %Q{Resourcy is an unobtrusive RESTful adapter for jquery-ujs and Rails that allows javascript route handling}
  s.licenses    = ['MIT']


  # Runtime Dependencies
  s.add_dependency 'railties', '~> 3.2.8'

  # Testing dependencies
  s.add_development_dependency 'evergreen', '>= 1.0.0'

  # Gem Files
  s.extra_rdoc_files  = %w(LICENSE)
  # = MANIFEST =
  s.files             = Dir['lib/**/*', 'vendor/assets/**/*']
  s.test_files        = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables       = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  # = MANIFEST =
  s.require_paths     = %w(lib)

end
