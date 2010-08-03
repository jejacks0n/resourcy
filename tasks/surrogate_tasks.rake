javascript_files = %w[surrogate]

namespace :surrogate do
  desc "Build surrogate into the distro"
  task :build => [:copy_js] do

  end

  desc "Copy development js files to distro"
  task :copy_js do
    thisfile = File.dirname(__FILE__)
    output_path = "#{thisfile}/../public/distro"
    input_path = "#{thisfile}/../public/javascripts"

    code = ''
    javascript_files.each do |file|
      code << File.read("#{input_path}/#{file}.js")
    end

    File.open("#{output_path}/surrogate.js", 'wb') { |file| file.write(code) }
  end

end
