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

# Teabag
# -----------------------------------------------------------------------------
desc "Run javascript specs"
task :teabag => 'app:teabag'

# Resourcy
# -----------------------------------------------------------------------------
namespace :resourcy do

  desc "Builds Resourcy into the distribution ready bundle"
  task :build => "build:javascripts"

  namespace :build do

    desc "Compile coffeescripts into javacripts"
    task :javascripts => :environment do
      env = Rails.application.assets

      %w(resourcy.js jquery.resourcy.js).each do |path|
        asset = env.find_asset(path)
        asset.write_to(Resourcy::Engine.root.join("distro/#{path}"))
        File.open(Resourcy::Engine.root.join("distro/#{path.gsub(/\.js/, '.min.js')}"), 'w') do |file|
          file.write(Uglifier.compile(asset.source))
        end
      end
    end

  end

end

# Default
# -----------------------------------------------------------------------------
#Rake::Task['default'].prerequisites.clear
#Rake::Task['default'].clear

task :default => [:teabag]
