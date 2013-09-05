require 'dragonfly'

## initialize Dragonfly ##

app = Dragonfly[:images]
app.configure_with(:rails)
app.configure_with(:imagemagick)
app.configure_with(:heroku, 'allenginsberg') if Rails.env.production?
# app.define_macro(ActiveRecord::Base, :image_accessor)

## configure it ##

Dragonfly[:images].configure do |c|
  # Convert absolute location needs to be specified
  # to avoid issues with Phusion Passenger not using $PATH
  c.convert_command  = `which convert`.strip.presence || "/usr/local/bin/convert"
  c.identify_command = `which identify`.strip.presence || "/usr/local/bin/identify"

  c.allow_fetch_url  = true
  c.allow_fetch_file = true

  c.url_format = '/images/dynamic/:job/:basename.:format'
end
