require 'active_record'
require 'dragonfly'

## initialize Dragonfly ##

app = Dragonfly[:images]
app.configure_with(:rails)
app.configure_with(:imagemagick)

if Rails.env.production?
  app.configure do |c|
    c.datastore = Dragonfly::DataStorage::S3DataStore.new(
      :bucket_name => 'allenginsberg',
      :access_key_id => ENV['S3_KEY'],
      :secret_access_key => ENV['S3_SECRET']
    )
    # trial
    # c.url_host = 'http://allen-ginsberg-org.herokuapp.com'
      # First we configure our before_serve method,
      # Before serving, the first time it is requested stores the thumbnail in the datastore
    c.server.before_serve do |job, env|
      uid = job.store
      # Keep track of its uid
      # Holds all the job info, e.g fetch 'image_uid' then resize to '40x40'
      Thumb.create!( :uid => uid, :job => job.serialize )
    end

    # Next we define the url for our processed images, overriding the default .url method...
    c.define_url do |app, job, opts|
      thumb = Thumb.find_by_job(job.serialize)
      # If (the job fetch 'image_uid' then resize to '40x40') has been stored already..
      # then serve the url from the datastore filesystem, s3, etc
      if thumb
        app.datastore.url_for(thumb.uid)
      else
      # ...otherwise if the job hasn't been stored, serve it from the Dragonfly server as usual
        app.server.url_for(job)
      end
    end
    # end trial
  end

  # Alt method
  # app.datastore = Dragonfly::DataStorage::S3DataStore.new
  # app.datastore.configure do |c|
  #   c.bucket_name = 'allenginsberg'
  #   c.access_key_id = ENV['S3_KEY']
  #   c.secret_access_key = ENV['S3_SECRET']
  #   c.region = 'us-west-2'                        # defaults to 'us-east-1'
  #   # c.storage_headers = {'some' => 'thing'}       # defaults to {'x-amz-acl' => 'public-read'}
  #   # c.url_scheme = 'https'                        # defaults to 'http'  
  # end
end

app.define_macro(ActiveRecord::Base, :image_accessor)

## configure it ##

Dragonfly[:images].configure do |c|
  # Convert absolute location needs to be specified
  # to avoid issues with Phusion Passenger not using $PATH
  c.convert_command  = `which convert`.strip.presence || "/usr/local/bin/convert"
  c.identify_command = `which identify`.strip.presence || "/usr/local/bin/identify"

  c.allow_fetch_url  = true
  c.allow_fetch_file = true

  c.url_format = '/images/dynamic/:job/:basename.:format'

  # # Override the .url method...
  # c.define_url do |app, job, opts|
  #   thumb = Thumb.find_by_job(job.serialize)
  #   # If (fetch 'some_uid' then resize to '40x40') has been stored already, give the datastore's remote url ...
  #   if thumb
  #     app.datastore.url_for(thumb.uid)
  #   # ...otherwise give the local Dragonfly server url
  #   else
  #     app.server.url_for(job)
  #   end
  # end

  # # Before serving from the local Dragonfly server...
  # c.server.before_serve do |job, env|
  #   # ...store the thumbnail in the datastore...
  #   uid = job.store

  #   # ...keep track of its uid so next time we can serve directly from the datastore
  #   Thumb.create!(
  #     :uid => uid,
  #     :job => job.serialize     # 'BAhbBls...' - holds all the job info
  #   )                           # e.g. fetch 'some_uid' then resize to '40x40'
  # end

end
