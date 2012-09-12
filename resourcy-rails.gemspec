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
  s.summary     = %Q{Resourcy: Awesome RESTful javascript resource routing}
  s.description = %Q{A RESTful javascript router that can be used with jquery-ujs and Rails for client route handling}
  s.licenses    = ['MIT']


  # Runtime Dependencies
  s.add_dependency 'railties', '~> 3.2.8'
  s.add_dependency 'coffee-rails'

  # Development dependencies
  s.add_development_dependency 'sprockets', '~> 2.1'
  s.add_development_dependency 'uglifier'
  s.add_development_dependency 'sprockets-rails'

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
