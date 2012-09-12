#!/usr/bin/env rake
begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end


# Dummy App
# -----------------------------------------------------------------------------
APP_RAKEFILE = File.expand_path("../spec/dummy/Rakefile", __FILE__)
load 'rails/tasks/engine.rake'
Bundler::GemHelper.install_tasks


# Evergreen
# -----------------------------------------------------------------------------
require 'evergreen/tasks'


# Resourcy
# -----------------------------------------------------------------------------
namespace :resourcy do
  require 'uglifier'
  require 'sprockets-rails'

  desc "Builds Resourcy into the distribution ready package"
  task :build => ['build:javascripts']

  namespace :build do

    desc "Combine javascripts into resourcy.js and resourcy.min.js"
    task :javascripts => :environment do
      env    = Rails.application.assets
      target = Pathname.new(File.join(Resourcy::Engine.root.join('distro'), 'build'))
      manifest = {}

      ['resourcy.js', 'jquery.resourcy.js'].each do |path|
        env.each_logical_path do |logical_path|
          if path.is_a?(Regexp)
            next unless path.match(logical_path)
          else
            next unless File.fnmatch(path.to_s, logical_path)
          end

          if asset = env.find_asset(logical_path)
            manifest[logical_path] = asset.digest_path
            filename = target.join(asset.digest_path)
            mkdir_p filename.dirname
            asset.write_to(filename)
          end
        end
      end

      for base in ['resourcy*.js', 'jquery.resourcy*.js']
        Dir[Resourcy::Engine.root.join('distro/build', base)].each do |filename|
          copy_file(filename, Resourcy::Engine.root.join("distro/#{base.gsub(/\*/, '')}"))
          minified = Uglifier.compile(File.read(filename))
          File.open(Resourcy::Engine.root.join("distro/#{base.gsub(/\*/, '.min')}.js"), 'w') do |file|
            file.write(minified)
          end
          remove(filename)
        end
      end
    end

  end

end

task :default => ['spec:javascripts']
