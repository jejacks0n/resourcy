require 'packr'

javascript_files = %w[resourcy]

namespace :resourcy do
  desc "Build resourcy for distribution"
  task :build => [:copy_js] do

  end

  desc "Combine, minify, and pack development js files for distribution"
  task :copy_js do
    thisfile = File.dirname(__FILE__)
    output_path = "#{thisfile}/../public/distro"
    input_path = "#{thisfile}/../public/javascripts"

    code = ''
    javascript_files.each do |file|
      code << File.read("#{input_path}/#{file}.js")
    end

    File.open("#{output_path}/resourcy.js", 'wb') { |file| file.write(code) }
    File.open("#{output_path}/resourcy.min.js", 'wb') do |file|
      file.write(Packr.pack(code, :base62 => true))
    end
  end

end
